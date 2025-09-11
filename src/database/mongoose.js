import mongoose from 'mongoose'

const MONGODB_URL = process.env.MONGODB_URL

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn
  if (!MONGODB_URL) throw new Error('MONGODB_URL is missing!')
  cached.promise = cached.promise || mongoose.connect(MONGODB_URL, { dbName: 'planWab', bufferCommands: false })
  cached.conn = await cached.promise
  return cached.conn
}

export default connectToDatabase;
