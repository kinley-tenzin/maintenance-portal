import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json(
      { message: 'Database initialized successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { message: 'Failed to initialize database', error: error.message },
      { status: 500 }
    );
  }
} 