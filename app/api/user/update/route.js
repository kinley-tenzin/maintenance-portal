import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function PUT(req) {
  try {
    // Get token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { username, email, currentPassword, newPassword } = await req.json();
    const { db } = await connectToDatabase();

    // Find user
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check for duplicate username/email (if changed)
    if (username && username !== user.username) {
      const existingUser = await db.collection('users').findOne({ username });
      if (existingUser) {
        return NextResponse.json({ message: 'Username already taken' }, { status: 400 });
      }
    }
    if (email && email !== user.email) {
      const existingEmail = await db.collection('users').findOne({ email });
      if (existingEmail) {
        return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
      }
    }

    // Prepare update object
    const update = { username, email };

    // Handle password change if requested
    if (currentPassword && newPassword) {
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ message: 'New password must be at least 6 characters long' }, { status: 400 });
      }
      update.password = await bcrypt.hash(newPassword, 10);
    }

    // Remove undefined fields
    Object.keys(update).forEach(key => update[key] === undefined && delete update[key]);

    // Update user
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: update }
    );

    // Log the profile update activity
    await db.collection('user_activities').insertOne({
      userId,
      type: 'profile_update',
      description: 'Profile updated',
      timestamp: new Date()
    });

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 