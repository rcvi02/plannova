import 'dotenv/config'
import app from './app.js'
import connectDB from './config/db.js'
import { initCronJobs } from './jobs/cronJobs.js'

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 StudyFlow API running on port ${PORT}`)
    console.log(`📍 Environment: ${process.env.NODE_ENV}`)
    console.log(`🌍 Client URL: ${process.env.CLIENT_URL}`)
    console.log(`\n📋 API Routes:`)
    console.log(`   GET  http://localhost:${PORT}/api/health`)
    console.log(`   POST http://localhost:${PORT}/api/auth/register`)
    console.log(`   POST http://localhost:${PORT}/api/auth/login`)
  })

  initCronJobs()

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('\n⚡ SIGTERM received. Shutting down gracefully...')
    server.close(() => {
      console.log('✅ Server closed.')
      process.exit(0)
    })
  })

  process.on('unhandledRejection', (err) => {
    console.error('💥 Unhandled rejection:', err.message)
    server.close(() => process.exit(1))
  })
}

startServer()
