import rateLimit from 'express-rate-limit'

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  })

// Auth routes: 1000 attempts per 15 minutes (bumped for dev)
export const authLimiter = createLimiter(
  15 * 60 * 1000,
  1000,
  'Too many login attempts. Please try again in 15 minutes.'
)

// General API: 200 requests per minute
export const apiLimiter = createLimiter(
  60 * 1000,
  200,
  'Too many requests. Please slow down.'
)

// Upload: 20 per hour
export const uploadLimiter = createLimiter(
  60 * 60 * 1000,
  20,
  'Too many file uploads. Please try again later.'
)
