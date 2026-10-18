import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoSanitize from 'express-mongo-sanitize'
import { apiLimiter } from './middleware/rateLimiter.js'
import errorHandler from './middleware/errorHandler.js'

// Routes
import authRoutes from './routes/auth.routes.js'
import subjectRoutes from './routes/subject.routes.js'
import taskRoutes from './routes/task.routes.js'
import examRoutes from './routes/exam.routes.js'
import sessionRoutes from './routes/session.routes.js'
import noteRoutes from './routes/note.routes.js'
import revisionRoutes from './routes/revision.routes.js'
import goalRoutes from './routes/goal.routes.js'
import habitRoutes from './routes/habit.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import miscRoutes from './routes/misc.routes.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ─── Security ───────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/$/, ''))
  : []

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
]

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]))

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    // Allow Vercel preview deployments if needed
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true)
    }
    callback(new Error(`CORS policy does not allow access from origin: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

// ─── Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── Sanitization ────────────────────────────────────────────────────────────
app.use(mongoSanitize())

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// ─── Rate limiting ───────────────────────────────────────────────────────────
app.use('/api', apiLimiter)

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Plannova API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
  })
})

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/exams', examRoutes)
app.use('/api/study-sessions', sessionRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/revisions', revisionRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/habits', habitRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api', miscRoutes) // dashboard, analytics, search, uploads

// ─── API 404 handler ─────────────────────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` })
})

// ─── Serve React Frontend in Production ───────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../client/dist')
  app.use(express.static(distPath))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'))
  })
} else {
  app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` })
  })
}

// ─── Global error handler ────────────────────────────────────────────────────
app.use(errorHandler)

export default app
