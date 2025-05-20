import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET(req) {
  try {
    const { db } = await connectToDatabase();
    const technicians = await db.collection('technicians').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ technicians });
  } catch (error) {
    console.error('Fetch technicians error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, email, phone, specialization } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Check if email already exists
    const existingTechnician = await db.collection('technicians').findOne({ email });
    if (existingTechnician) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }

    // First, try to remove the userId index if it exists
    try {
      await db.collection('technicians').dropIndex('userId_1');
    } catch (e) {
      // Ignore error if index doesn't exist
    }

    const result = await db.collection('technicians').insertOne({
      name,
      email,
      phone: phone || '',
      specialization: specialization || '',
      isAvailable: true,
      createdAt: new Date(),
      // Explicitly set userId to null to avoid the unique constraint
      userId: null
    });
    return NextResponse.json({ message: 'Technician added', id: result.insertedId });
  } catch (error) {
    console.error('Add technician error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 