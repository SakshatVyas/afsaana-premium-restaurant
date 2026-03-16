import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// We save bookings to a local JSON file in /data/bookings.json
const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

// Ensure the data directory and bookings file exist
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(BOOKINGS_FILE)) {
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2));
    }
  } catch (err) {
    console.warn("Could not ensure data directory (likely Vercel environment):", err);
  }
}

// Read all bookings safely
function readBookings(): any[] {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(BOOKINGS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

// Generate a unique booking reference
function generateRef(): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `AFS-${dateStr}-${rand}`;
}

// ============================================================
// NTFY.SH PUSH NOTIFICATION — Free, no sign-up needed!
// Owner: Install "ntfy" app on Android/iOS → subscribe to topic
// ============================================================
async function sendNtfyNotification(booking: any) {
  const NTFY_TOPIC = process.env.NTFY_TOPIC || "afsaana-bookings-private";

  const message = [
    `👤 ${booking.name}  |  📞 ${booking.phone}`,
    `📅 ${booking.date}  |  🕐 ${booking.time}`,
    `👥 ${booking.guests} Guest(s)`,
    booking.specialRequest ? `📝 Note: ${booking.specialRequest}` : "",
    `🔖 Ref: ${booking.ref}`,
  ].filter(Boolean).join("\n");

  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: "POST",
      headers: {
        "Title": "New Booking - Afsaana Restaurant",
        "Priority": "high",
        "Tags": "restaurant,tada",
        "Content-Type": "text/plain; charset=utf-8",
      },
      body: message,
    });
    console.log(`ntfy notification sent to topic: ${NTFY_TOPIC}`);
  } catch (err) {
    console.error("ntfy notification failed (booking still saved):", err);
  }
}

// Send email to owner via Gmail SMTP
async function sendOwnerEmail(booking: any) {
  if (!process.env.GMAIL_USER || process.env.GMAIL_USER === 'your-gmail@gmail.com') {
    console.log("Email not configured. Skipping notification for booking:", booking.ref);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const ownerEmailHtml = `
    <!DOCTYPE html>
    <html>
    <body style="background:#0A0A0C;color:#ffffff;font-family:Georgia,serif;padding:40px;">
      <div style="max-width:600px;margin:0 auto;border:1px solid #CFAE6D22;padding:40px;">
        <h1 style="color:#CFAE6D;font-size:28px;margin-bottom:4px;">🍽️ New Table Booking</h1>
        <p style="color:#888;font-size:12px;margin-bottom:32px;letter-spacing:4px;">AFSAANA BY SCOOTERS</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="border-bottom:1px solid #222;"><td style="padding:12px 0;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Booking Ref</td><td style="padding:12px 0;color:#CFAE6D;font-size:16px;font-weight:bold;">${booking.ref}</td></tr>
          <tr style="border-bottom:1px solid #222;"><td style="padding:12px 0;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Customer</td><td style="padding:12px 0;color:#fff;">${booking.name}</td></tr>
          <tr style="border-bottom:1px solid #222;"><td style="padding:12px 0;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Phone</td><td style="padding:12px 0;color:#fff;">${booking.phone}</td></tr>
          <tr style="border-bottom:1px solid #222;"><td style="padding:12px 0;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Date</td><td style="padding:12px 0;color:#fff;">${booking.date}</td></tr>
          <tr style="border-bottom:1px solid #222;"><td style="padding:12px 0;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Time</td><td style="padding:12px 0;color:#fff;">${booking.time}</td></tr>
          <tr style="border-bottom:1px solid #222;"><td style="padding:12px 0;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Guests</td><td style="padding:12px 0;color:#fff;">${booking.guests} Guest(s)</td></tr>
          <tr><td style="padding:12px 0;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Special Request</td><td style="padding:12px 0;color:#fff;">${booking.specialRequest || "None"}</td></tr>
        </table>
        <div style="margin-top:32px;padding:16px;background:#CFAE6D11;border-left:3px solid #CFAE6D;">
          <p style="color:#CFAE6D;font-size:12px;margin:0;">⏰ Booked at ${new Date(booking.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Afsaana Bookings" <${process.env.GMAIL_USER}>`,
    to: process.env.OWNER_EMAIL || process.env.GMAIL_USER,
    subject: `🍽️ New Booking: ${booking.name} — ${booking.date} @ ${booking.time} [${booking.ref}]`,
    html: ownerEmailHtml,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, date, time, guests, specialRequest } = body;

    // Validate required fields
    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // ============================================================
    // TIME SLOT CONFLICT DETECTION
    // Check if date + time is already booked by any confirmed booking
    // ============================================================
    const existingBookings = readBookings();
    const conflict = existingBookings.find(
      (b: any) =>
        b.date === date &&
        b.time === time &&
        b.status === "confirmed"
    );

    if (conflict) {
      return NextResponse.json(
        {
          error: `This time slot (${time} on ${date}) is already fully booked. Please choose a different time.`,
          conflictRef: conflict.ref,
        },
        { status: 409 }
      );
    }

    // Create the new booking
    const booking = {
      ref: generateRef(),
      name,
      phone,
      date,
      time,
      guests,
      specialRequest: specialRequest || "",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Try to save booking to JSON file (will fail on Vercel read-only FS, which is fine)
    try {
      existingBookings.push(booking);
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(existingBookings, null, 2));
    } catch (saveError) {
      console.warn("Could not save to local filesystem (likely Vercel):", saveError);
    }

    // Fire all notifications in parallel — errors don't fail the booking
    await Promise.allSettled([
      sendNtfyNotification(booking),
      sendOwnerEmail(booking),
    ]);

    return NextResponse.json({ success: true, booking }, { status: 200 });
  } catch (err) {
    console.error("Booking API error:", err);
    return NextResponse.json({ error: "Server error. Please call us directly." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = readBookings();
    return NextResponse.json({ bookings }, { status: 200 });
  } catch {
    return NextResponse.json({ bookings: [] }, { status: 200 });
  }
}
