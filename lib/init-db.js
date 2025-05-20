import { connectToDatabase } from './db';

export async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase();

    // Create users collection with indexes
    await db.createCollection('users');
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true }
    ]);

    // Create newsletter collection with index
    await db.createCollection('newsletter');
    await db.collection('newsletter').createIndex(
      { email: 1 },
      { unique: true }
    );

    // Create maintenance_requests collection with indexes
    await db.createCollection('maintenance_requests');
    await db.collection('maintenance_requests').createIndexes([
      { key: { userId: 1 } },
      { key: { status: 1 } },
      { key: { createdAt: 1 } }
    ]);

    // Create technicians collection with indexes
    await db.createCollection('technicians');
    // Drop all existing indexes
    await db.collection('technicians').dropIndexes();
    // Create new indexes without userId
    await db.collection('technicians').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { isAvailable: 1 } },
      { key: { specialization: 1 } }
    ]);

    // Create appointments collection with indexes
    await db.createCollection('appointments');
    await db.collection('appointments').createIndexes([
      { key: { requestId: 1 } },
      { key: { technicianId: 1 } },
      { key: { userId: 1 } },
      { key: { scheduledDate: 1 } }
    ]);

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
} 