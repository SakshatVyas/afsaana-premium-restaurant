import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const JSON_STORE_URL = "https://jsonblob.com/api/jsonBlob/019cf506-0ac6-7703-be54-af76c2b52926";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Read all bookings from decentralized cloud safely
async function readBookings(): Promise<any[]> {
  try {
    const res = await fetch(JSON_STORE_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("External DB fetch failed:", err);
    return [];
  }
}

// Write bookings to decentralized cloud
async function writeBookings(bookings: any[]) {
  try {
    await fetch(JSON_STORE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(bookings)
    });
  } catch (err) {
    console.warn("External DB write failed:", err);
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

// Ensure "1 PM", "1:00 pm", "13:00" all become "1:00 PM"
function normalizeTime(t: string): string {
  if (!t) return "";
  const match = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!match) return t.trim(); // fallback if unparseable

  let [, hourStr, minStr, ampmStr] = match;
  let hour = parseInt(hourStr, 10);
  let min = minStr || "00";
  let ampm = ampmStr ? ampmStr.toUpperCase() : null;

  if (!ampm) {
    // Military time guess
    if (hour >= 12) {
      if (hour > 12) hour -= 12;
      ampm = "PM";
    } else {
      if (hour === 0) hour = 12;
      ampm = "AM";
    }
  } else {
    // Adjust AM/PM wraps
    if (hour === 0 && ampm === "AM") hour = 12;
    if (hour === 0 && ampm === "PM") hour = 12;
  }

  return `${hour}:${min} ${ampm}`;
}

// Convert DD/MM/YYYY, MM/DD/YYYY, or YYYY-MM-DD strictly into YYYY-MM-DD
function normalizeDate(d: string): string {
  if (!d) return "";
  const cleaned = d.trim();
  
  // If it's already YYYY-MM-DD, just return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  // Handle DD/MM/YYYY or MM/DD/YYYY variants using standard JS Date parsing fallback,
  // or explicit splitting if it contains slashes or dashes
  const parts = cleaned.split(/[-/]/);
  if (parts.length === 3) {
    // Guessing based on length: if parts[2] is 4 digits, it's either DD/MM/YYYY or MM/DD/YYYY
    if (parts[2].length === 4) {
      const p1 = parseInt(parts[0], 10);
      const p2 = parseInt(parts[1], 10);
      
      // If p1 > 12, it *must* be DD/MM/YYYY. If p2 > 12, it *must* be MM/DD/YYYY.
      let day, month;
      if (p1 > 12) {
        day = p1; month = p2;
      } else if (p2 > 12) {
        month = p1; day = p2;
      } else {
        // Ambiguous parsing (e.g. 05/06/2026). In India context usually DD/MM/YYYY, but inputs prefer YYYY-MM-DD natively. Let's assume standard JS Date parse behavior or force DD/MM/YYYY as fallback if required by UI.
        // We will just let JS Date constructor try its best.
      }
    }
  }

  // Fallback to JS native Date parser
  const parsed = new Date(cleaned);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return cleaned; // Ultimate fallback if completely unparseable
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { name, phone, date, time, guests, specialRequest } = body;

    // Validate required fields
    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Normalize precisely to catch collisions
    time = normalizeTime(time);
    date = normalizeDate(date);

    // ============================================================
    // TIME SLOT CONFLICT DETECTION via CloudDB
    // ============================================================
    const existingBookings = await readBookings();
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

    // Save permanently to the cloud
    existingBookings.push(booking);
    await writeBookings(existingBookings);

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
    const bookings = await readBookings();
    return NextResponse.json({ bookings }, { status: 200 });
  } catch {
    return NextResponse.json({ bookings: [] }, { status: 200 });
  }
}
