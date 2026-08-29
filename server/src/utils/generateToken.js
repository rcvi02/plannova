import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  })
}

export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret)
}

export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}
