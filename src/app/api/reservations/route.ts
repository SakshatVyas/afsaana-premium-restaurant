import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

function readBookings() {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) return [];
    return JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8'));
  } catch (err) {
    console.log("Could not read bookings file (likely Vercel environment):", err);
    return [];
  }
}

// GET — return all real bookings from bookings.json
export async function GET() {
  const bookings = readBookings();
  return NextResponse.json(bookings);
}
