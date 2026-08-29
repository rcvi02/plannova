import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { sendError } from '../utils/apiResponse.js'

const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.token) {
    token = req.cookies.token
  }

  if (!token) {
    return sendError(res, { message: 'Not authorized. No token provided.', statusCode: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password -resetPasswordToken -resetPasswordExpire -verificationToken')

    if (!user) {
      return sendError(res, { message: 'User not found. Token invalid.', statusCode: 401 })
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, { message: 'Token expired. Please login again.', statusCode: 401 })
    }
    return sendError(res, { message: 'Token invalid.', statusCode: 401 })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return sendError(res, { message: 'Admin access required.', statusCode: 403 })
  }
  next()
}

export { protect, adminOnly }
