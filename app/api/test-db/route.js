import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Try to ping the database
    await db.command({ ping: 1 });
    
    return NextResponse.json(
      { 
        message: 'Successfully connected to MongoDB',
        status: 'connected'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to connect to MongoDB',
        error: error.message
      },
      { status: 500 }
    );
  }
} 