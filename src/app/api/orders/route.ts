import { NextResponse } from 'next/server';

const orders: any[] = [
  { id: "ORD-5091", type: "Delivery", items: 3, total: 2450, status: "Preparing", time: "10 mins ago" },
  { id: "ORD-5092", type: "Pickup", items: 1, total: 650, status: "Ready", time: "2 mins ago" }
];

export async function GET() {
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newOrder = {
      id: `ORD-${Math.floor(5000 + Math.random() * 4000)}`,
      ...data,
      status: "Received",
      time: "Just now"
    };
    
    orders.push(newOrder);
    
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
  }
}
