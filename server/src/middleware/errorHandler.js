import mongoose from 'mongoose'
import { sendError } from '../utils/apiResponse.js'

/**
 * Centralized error handler — must be last middleware in Express
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = `Resource not found with id: ${err.value}`
    statusCode = 404
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    message = `A record with that ${field} already exists.`
    statusCode = 409
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(e => e.message).join(', ')
    statusCode = 400
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token.'
    statusCode = 401
  }
  if (err.name === 'TokenExpiredError') {
    message = 'Token expired. Please login again.'
    statusCode = 401
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File too large. Maximum size is 5MB.'
    statusCode = 400
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    message = 'Unexpected file field.'
    statusCode = 400
  }

  // Hide stack in production
  const response = {
    success: false,
    message,
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
  }

  res.status(statusCode).json(response)
}

export default errorHandler
