import mongoose from 'mongoose'

const connectDB = async () => {
  const maxRetries = 5
  let retries = 0
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plannova'

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        retryWrites: true,
        w: 'majority',
      })
      console.log(`✅ MongoDB connected: ${conn.connection.host} [DB: ${conn.connection.name}]`)
      return conn
    } catch (err) {
      retries++
      console.error(`❌ MongoDB connection failed (attempt ${retries}/${maxRetries}):`, err.message)
      if (uri.includes('localhost')) {
        uri = uri.replace('localhost', '127.0.0.1')
        console.log(`🔄 Retrying with IPv4 fallback: ${uri}`)
      }
      if (retries === maxRetries) {
        console.error('💀 Max retries reached. Exiting...')
        process.exit(1)
      }
      await new Promise(res => setTimeout(res, 2500))
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
