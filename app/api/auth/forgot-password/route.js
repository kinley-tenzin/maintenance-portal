import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      // For security reasons, don't reveal if the email exists or not
      return NextResponse.json(
        { message: 'If your email is registered, you will receive password reset instructions' },
        { status: 200 }
      );
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the reset token in the database
    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry
        }
      }
    );

    // In a real application, you would send an email here with the reset link
    // For now, we'll just return the token (in production, remove this)
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    return NextResponse.json(
      { 
        message: 'Password reset instructions sent to your email',
        // Remove this in production
        resetLink
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Error processing password reset request' },
      { status: 500 }
    );
  }
} 