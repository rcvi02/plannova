import mongoose from 'mongoose'
import dns from 'dns'

// Ensure Atlas SRV records resolve cleanly even if local Windows router DNS drops SRV queries
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
} catch {
  // Ignore in restricted environments
}

const connectDB = async () => {
  const maxRetries = 5
  let retries = 0
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plannova'

  if (uri.includes('YOUR_USERNAME') || uri.includes('YOUR_NEW_PASSWORD')) {
    console.warn('⚠️  MONGODB_URI contains placeholder credentials (YOUR_USERNAME:YOUR_NEW_PASSWORD).')
    console.warn('👉 Replace them in server/.env with your real MongoDB Atlas credentials to connect to Atlas.')
    console.warn('🔄 Falling back to local MongoDB (127.0.0.1:27017) in the meantime...')
    uri = 'mongodb://127.0.0.1:27017/plannova'
  }

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
