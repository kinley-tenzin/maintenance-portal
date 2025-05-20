import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function PATCH(req, { params }) {
  try {
    const complaintId = params.id;
    const body = await req.json();
    const { assignedTo, status } = body;
    const { db } = await connectToDatabase();
    let update = {};
    if (assignedTo) {
      update.assignedTo = assignedTo;
    }
    if (status) {
      update.status = status;
      if (status === 'Resolved') {
        update.date = new Date();
      }
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }
    // Update the complaint
    const updateResult = await db.collection('complaints').updateOne(
      { _id: new ObjectId(complaintId) },
      { $set: update }
    );
    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ message: 'Complaint not found' }, { status: 404 });
    }
    // If assigning staff, create an appointment
    if (assignedTo) {
      const staff = await db.collection('technicians').findOne({ _id: new ObjectId(assignedTo) });
      const staffName = staff ? staff.name : '';
      await db.collection('appointments').insertOne({
        complaintId: new ObjectId(complaintId),
        staffId: new ObjectId(assignedTo),
        staffName,
        assignedAt: new Date(),
        status: 'assigned',
      });
    }
    return NextResponse.json({ message: 'Complaint updated successfully' });
  } catch (error) {
    console.error('Complaint update error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const complaintId = params.id;
    const { db } = await connectToDatabase();
    const deleteResult = await db.collection('complaints').deleteOne({ _id: new ObjectId(complaintId) });
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ message: 'Complaint not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Complaint delete error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 