import mongoose from 'mongoose';
import { env } from './env.js';

let memoryServer = null;

/**
 * Connects to MongoDB. If no MONGO_URI is configured (or USE_MEMORY_DB=true),
 * spins up an in-memory MongoDB so the app runs with zero external setup.
 */
export async function connectDb() {
  mongoose.set('strictQuery', true);

  let uri = env.mongoUri;

  if (!uri || env.useMemoryDb) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri('byteclub');
    console.log('▸ Using in-memory MongoDB (no MONGO_URI set)');
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`▸ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);

  return mongoose.connection;
}

export async function disconnectDb() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}

export function isMemoryDb() {
  return Boolean(memoryServer);
}
