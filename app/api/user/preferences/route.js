import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verify } from 'jsonwebtoken';

export async function GET(req) {
  try {
    // Get token from cookies
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { db } = await connectToDatabase();

    // Get user's preferences
    const userPreferences = await db.collection('user_preferences')
      .findOne({ userId });

    return NextResponse.json({
      preferences: userPreferences || {
        emailNotifications: true,
        smsNotifications: false,
        darkMode: false,
        language: 'en'
      }
    });
  } catch (error) {
    console.error('Preferences fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    // Get token from cookies
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const updates = await req.json();
    const { db } = await connectToDatabase();

    // Update user's preferences
    await db.collection('user_preferences').updateOne(
      { userId },
      { $set: updates },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 