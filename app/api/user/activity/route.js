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

    // Get user's activity history
    const activities = await db.collection('user_activities')
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Activity fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 