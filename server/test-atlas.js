import mongoose from 'mongoose'
import dotenv from 'dotenv'

import path from 'path'
import { fileURLToPath } from 'url'
import dns from 'dns'

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
} catch {}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

const testConnection = async () => {
  const uri = process.env.MONGODB_URI
  console.log('Testing connection to:', uri.replace(/:([^@]+)@/, ':****@'))

  if (uri.includes('YOUR_USERNAME') || uri.includes('YOUR_NEW_PASSWORD')) {
    console.error('❌ Error: Please replace YOUR_USERNAME and YOUR_NEW_PASSWORD in server/.env with your actual MongoDB Atlas database credentials.')
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      retryWrites: true,
      w: 'majority',
    })
    console.log(`✅ Success! Successfully connected to MongoDB Atlas!`)
    console.log(`📡 Host: ${conn.connection.host}`)
    console.log(`🗄️ Database: ${conn.connection.name}`)
    await mongoose.disconnect()
    console.log('Connection closed cleanly.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Connection Failed:', err.message)
    if (err.message.includes('Authentication failed') || err.message.includes('bad auth')) {
      console.error('👉 Tip: Check your Atlas username and password in Database Access.')
    } else if (err.message.includes('querySrv ENOTFOUND') || err.message.includes('buffering timed out')) {
      console.error('👉 Tip: Ensure you have added 0.0.0.0/0 to Network Access (IP Whitelist) on MongoDB Atlas.')
    }
    process.exit(1)
  }
}

testConnection()
