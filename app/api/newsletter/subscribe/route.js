import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if email already subscribed
    const existingSubscriber = await db.collection('newsletter').findOne({ email });

    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Add subscriber
    await db.collection('newsletter').insertOne({
      email,
      subscribedAt: new Date(),
      status: 'active'
    });

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 