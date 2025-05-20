import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET(req) {
  try {
    const { db } = await connectToDatabase();
    const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 