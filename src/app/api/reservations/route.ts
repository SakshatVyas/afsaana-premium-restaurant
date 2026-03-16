import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const JSON_STORE_URL = "https://jsonblob.com/api/jsonBlob/019cf506-0ac6-7703-be54-af76c2b52926";

async function readBookings(): Promise<any[]> {
  try {
    const res = await fetch(`${JSON_STORE_URL}?t=${Date.now()}`, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("External DB fetch failed:", err);
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const bookings = await readBookings();
    
    // Sort bookings by createdAt descending
    bookings.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (err) {
    console.error("Error fetching reservations:", err);
    return NextResponse.json({ error: "Failed to fetch reservations." }, { status: 500 });
  }
}
