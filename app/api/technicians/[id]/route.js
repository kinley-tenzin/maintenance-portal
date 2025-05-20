import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function PATCH(req, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    if (!id) return NextResponse.json({ message: 'Missing technician ID' }, { status: 400 });
    const update = await req.json();
    const result = await db.collection('technicians').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Technician not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Technician updated' });
  } catch (error) {
    console.error('Update technician error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    if (!id) return NextResponse.json({ message: 'Missing technician ID' }, { status: 400 });
    const result = await db.collection('technicians').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Technician not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Technician deleted' });
  } catch (error) {
    console.error('Delete technician error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 