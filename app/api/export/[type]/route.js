import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

function toCSV(data, fields) {
  const csvRows = [fields.join(',')];
  for (const row of data) {
    csvRows.push(fields.map(f => '"' + (row[f] ?? '').toString().replace(/"/g, '""') + '"').join(','));
  }
  return csvRows.join('\n');
}

export async function GET(req, { params }) {
  const { type } = params;
  let collection, fields, filename;
  if (type === 'complaints') {
    collection = 'complaints';
    fields = ['_id', 'block', 'roomId', 'category', 'status', 'assignedTo', 'date', 'text', 'createdAt'];
    filename = 'complaints.csv';
  } else if (type === 'users') {
    collection = 'users';
    fields = ['_id', 'username', 'email', 'role', 'active', 'createdAt'];
    filename = 'users.csv';
  } else if (type === 'staff') {
    collection = 'technicians';
    fields = ['_id', 'name', 'email', 'phone', 'specialization', 'isAvailable', 'createdAt'];
    filename = 'staff.csv';
  } else {
    return NextResponse.json({ message: 'Invalid export type' }, { status: 400 });
  }
  try {
    const { db } = await connectToDatabase();
    const data = await db.collection(collection).find({}).toArray();
    const csv = toCSV(data, fields);
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${filename}`,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Export error', error: error.message }, { status: 500 });
  }
} 