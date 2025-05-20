import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    // Get token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('avatar');
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Save file to /public/avatars
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${ext}`;
    const filePath = path.join(process.cwd(), 'public', 'avatars', fileName);
    fs.writeFileSync(filePath, buffer);

    // Update user document with imageUrl
    const imageUrl = `/avatars/${fileName}`;
    const { db } = await connectToDatabase();
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { imageUrl } }
    );

    return NextResponse.json({ message: 'Avatar uploaded', imageUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 