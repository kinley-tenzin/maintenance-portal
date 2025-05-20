import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verify } from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { block, roomId, category, text, date } = await req.json();
    if (!block || !roomId || !category || !text) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Try to get user info from token (optional, for logged-in users)
    let user = null;
    const token = req.cookies.get('token')?.value;
    if (token) {
      try {
        const decoded = verify(token, process.env.JWT_SECRET);
        user = {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
        };
      } catch (e) {}
    }

    const { db } = await connectToDatabase();
    await db.collection('complaints').insertOne({
      block,
      roomId,
      category,
      text,
      date: date || new Date().toISOString(),
      user,
      status: 'pending',
      createdAt: new Date(),
    });

    // Aggregate new complaint notifications
    const existingNotif = await db.collection('notifications').findOne({
      type: 'new_complaint',
      read: false
    });
    if (existingNotif) {
      const count = existingNotif.count ? existingNotif.count + 1 : 2;
      await db.collection('notifications').updateOne(
        { _id: existingNotif._id },
        { $set: { message: `${count} new complaints received`, count } }
      );
    } else {
      await db.collection('notifications').insertOne({
        type: 'new_complaint',
        message: '1 new complaint received',
        count: 1,
        createdAt: new Date(),
        read: false
      });
    }

    return NextResponse.json({ message: 'Complaint submitted successfully' });
  } catch (error) {
    console.error('Complaint submit error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { db } = await connectToDatabase();
    const complaints = await db.collection('complaints').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ complaints });
  } catch (error) {
    console.error('Fetch complaints error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 