import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database to get the latest imageUrl
      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });

      return NextResponse.json({ 
        authenticated: true,
        user: {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role,
          imageUrl: user?.imageUrl || null,
          createdAt: user?.createdAt || null
        }
      });
    } catch (error) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
} 