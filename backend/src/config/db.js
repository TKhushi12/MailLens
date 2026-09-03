import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim().length > 0) {
    try {
      console.log('Connecting to provided MongoDB URI...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] Connected to external MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Failed to connect to ${uri}: ${err.message}. Falling back to in-memory MongoDB...`);
    }
  }

  // In-memory fallback
  try {
    console.log('[Database] Starting in-memory MongoDB instance for zero-config operation...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] In-memory MongoDB connected successfully at ${memoryUri}`);
    return conn;
  } catch (err) {
    console.error('[Database] In-memory MongoDB failed to initialize:', err);
    throw err;
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
