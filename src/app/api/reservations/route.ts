import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Global in-memory cache for Vercel
declare global {
  var _afsaanaBookingsCache: any[];
}
if (!global._afsaanaBookingsCache) {
  global._afsaanaBookingsCache = [];
}

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

function readBookings() {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) {
      return global._afsaanaBookingsCache || [];
    }
    const data = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8'));
    
    // Merge local file data with in-memory cache to ensure nothing is lost during hot reloads or short Vercel sessions
    if (Array.isArray(data) && data.length > 0) {
      // Basic merge (this is a simple sync for demo/Vercel persistence)
      const merged = [...data];
      global._afsaanaBookingsCache.forEach(cb => {
        if (!merged.find(b => b.ref === cb.ref)) merged.push(cb);
      });
      global._afsaanaBookingsCache = merged;
      return merged;
    }
    
    return global._afsaanaBookingsCache || [];
  } catch (err) {
    console.log("Could not read bookings file (likely Vercel environment):", err);
    return global._afsaanaBookingsCache || [];
  }
}

// GET — return all real bookings from bookings.json
export async function GET() {
  const bookings = readBookings();
  return NextResponse.json(bookings);
}
