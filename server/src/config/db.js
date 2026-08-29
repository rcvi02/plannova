import mongoose from 'mongoose'

const connectDB = async () => {
  const maxRetries = 5
  let retries = 0

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      console.log(`✅ MongoDB connected: ${conn.connection.host}`)
      return conn
    } catch (err) {
      retries++
      console.error(`❌ MongoDB connection failed (attempt ${retries}/${maxRetries}):`, err.message)
      if (retries === maxRetries) {
        console.error('💀 Max retries reached. Exiting...')
        process.exit(1)
      }
      await new Promise(res => setTimeout(res, 3000))
    }
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err)
})

export default connectDB
