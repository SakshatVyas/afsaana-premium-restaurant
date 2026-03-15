import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BOOKINGS_FILE = path.join(process.cwd(), "data", "bookings.json");
const NTFY_TOPIC = process.env.NTFY_TOPIC || "afsaana-bookings-private";

function readBookings() {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) return [];
    return JSON.parse(fs.readFileSync(BOOKINGS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeBookings(bookings: any[]) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

async function sendCancellationNtfy(booking: any) {
  try {
    const message = [
      `BOOKING CANCELLED`,
      `Ref: ${booking.ref}`,
      `Guest: ${booking.name} | ${booking.phone}`,
      `Was booked for: ${booking.date} @ ${booking.time}`,
      `Guests: ${booking.guests}`,
      `WhatsApp sent to customer.`,
    ].join("\n");

    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: "POST",
      headers: {
        "Title": "Booking Cancelled - Afsaana",
        "Priority": "high",
        "Tags": "x,afsaana",
        "Content-Type": "text/plain; charset=utf-8",
      },
      body: message,
    });
  } catch (err) {
    console.error("ntfy cancel notification failed:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { ref } = await req.json();

    if (!ref) {
      return NextResponse.json({ error: "Booking reference is required." }, { status: 400 });
    }

    const bookings = readBookings();
    const index = bookings.findIndex((b: any) => b.ref === ref);

    if (index === -1) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const booking = bookings[index];

    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "Booking is already cancelled." }, { status: 400 });
    }

    // Mark as cancelled
    bookings[index] = { ...booking, status: "cancelled", cancelledAt: new Date().toISOString() };
    writeBookings(bookings);

    // Send owner ntfy notification (non-blocking)
    sendCancellationNtfy(booking);

    // Build WhatsApp click-to-send URL for owner to notify customer
    const rawPhone = booking.phone.replace(/\D/g, ""); // Strip non-digits
    // Prepend country code 91 if not already there
    const phone = rawPhone.startsWith("91") ? rawPhone : `91${rawPhone}`;

    const waMessage = encodeURIComponent(
      `Dear ${booking.name},\n\nWe regret to inform you that your table reservation at Afsaana by Scooters has been cancelled.\n\n` +
      `📅 Date: ${booking.date}\n` +
      `🕐 Time: ${booking.time}\n` +
      `👥 Guests: ${booking.guests}\n` +
      `🔖 Ref: ${booking.ref}\n\n` +
      `We sincerely apologise for any inconvenience caused. Please feel free to call us at 07095000024 to rebook or discuss further.\n\n` +
      `— Team Afsaana by Scooters`
    );

    const whatsappUrl = `https://wa.me/${phone}?text=${waMessage}`;

    return NextResponse.json({
      success: true,
      cancelledBooking: bookings[index],
      whatsappUrl,
    });
  } catch (err) {
    console.error("Cancel API error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
