import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import { generateAccessToken, generateRandomToken, hashToken } from '../utils/generateToken.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'
import { sendEmail } from '../config/email.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, course, college } = req.body

  const exists = await User.findOne({ email })
  if (exists) {
    return sendError(res, { message: 'An account with this email already exists.', statusCode: 409 })
  }

  const verificationToken = generateRandomToken()
  const user = await User.create({
    name, email, password, course, college,
    verificationToken: hashToken(verificationToken),
    verificationTokenExpire: new Date(Date.now() + 24 * 60 * 60 * 1000),
  })

  // Send verification email (non-blocking)
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`
  sendEmail({
    to: email,
    subject: 'Verify your Plannova account',
    html: `<p>Hi ${name},</p><p>Please <a href="${verifyUrl}">verify your email</a>. Link expires in 24 hours.</p>`,
  }).catch(console.error)

  const token = generateAccessToken(user._id)

  return sendSuccess(res, {
    message: 'Account created successfully! Welcome to Plannova.',
    data: { token, user: user.toPublicJSON() },
    statusCode: 201,
  })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return sendError(res, { message: 'Invalid email or password.', statusCode: 401 })
  }

  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return sendError(res, { message: 'Invalid email or password.', statusCode: 401 })
  }

  const token = generateAccessToken(user._id)

  return sendSuccess(res, {
    message: 'Logged in successfully.',
    data: { token, user: user.toPublicJSON() },
  })
})

// POST /api/auth/google
export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body
  
  if (!credential) {
    return sendError(res, { message: 'No Google credential provided', statusCode: 400 })
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        profileImage: picture,
        emailVerified: true
      })
    } else if (!user.googleId) {
      user.googleId = googleId
      await user.save()
    }

    const token = generateAccessToken(user._id)
    return sendSuccess(res, {
      message: 'Logged in with Google successfully.',
      data: { token, user: user.toPublicJSON() },
    })
  } catch (error) {
    return sendError(res, { message: 'Google authentication failed', statusCode: 401 })
  }
})

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, { message: 'User retrieved.', data: { user: req.user.toPublicJSON() } })
})

// PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name', 'course', 'college', 'semester', 'timezone',
    'dailyStudyGoal', 'preferredStudyStartTime', 'preferredStudyEndTime',
    'themePreference', 'notificationPreferences',
  ]
  const updates = {}
  allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f] })

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
  return sendSuccess(res, { message: 'Profile updated.', data: { user: user.toPublicJSON() } })
})

// POST /api/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user._id).select('+password')

  const isMatch = await user.matchPassword(currentPassword)
  if (!isMatch) {
    return sendError(res, { message: 'Current password is incorrect.', statusCode: 400 })
  }

  user.password = newPassword
  await user.save()

  return sendSuccess(res, { message: 'Password changed successfully.' })
})

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return sendSuccess(res, { message: 'If an account with that email exists, an OTP has been generated.' })
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  user.resetPasswordToken = hashToken(otp)
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  await user.save({ validateBeforeSave: false })

  // Instead of sending email, we return the OTP in the API response for demo purposes
  return sendSuccess(res, { 
    message: 'OTP generated successfully.', 
    data: { otp } 
  })
})

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { otp, password } = req.body
  
  if (!otp || !password) {
    return sendError(res, { message: 'Please provide both OTP and new password.', statusCode: 400 })
  }

  const hashedOTP = hashToken(otp)
  const user = await User.findOne({
    resetPasswordToken: hashedOTP,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return sendError(res, { message: 'Invalid or expired OTP.', statusCode: 400 })
  }

  user.password = password
  user.resetPasswordToken = null
  user.resetPasswordExpire = null
  await user.save()

  const token = generateAccessToken(user._id)
  return sendSuccess(res, { message: 'Password reset successful.', data: { token, user: user.toPublicJSON() } })
})

// POST /api/auth/verify-email/:token
export const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = hashToken(req.params.token)
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpire: { $gt: Date.now() },
  })

  if (!user) {
    return sendError(res, { message: 'Invalid or expired verification token.', statusCode: 400 })
  }

  user.emailVerified = true
  user.verificationToken = null
  user.verificationTokenExpire = null
  await user.save({ validateBeforeSave: false })

  return sendSuccess(res, { message: 'Email verified successfully.' })
})

// DELETE /api/auth/account
export const deleteAccount = asyncHandler(async (req, res) => {
  // Delete all user data across collections
  const userId = req.user._id
  const [Task, Subject, Exam, StudySession, Note, Revision, Goal, Habit, Notification] = await Promise.all([
    import('../models/Task.js'),
    import('../models/Subject.js'),
    import('../models/Exam.js'),
    import('../models/StudySession.js'),
    import('../models/Note.js'),
    import('../models/Revision.js'),
    import('../models/Goal.js'),
    import('../models/Habit.js'),
    import('../models/Notification.js'),
  ])

  await Promise.all([
    Task.default.deleteMany({ user: userId }),
    Subject.default.deleteMany({ user: userId }),
    Exam.default.deleteMany({ user: userId }),
    StudySession.default.deleteMany({ user: userId }),
    Note.default.deleteMany({ user: userId }),
    Revision.default.deleteMany({ user: userId }),
    Goal.default.deleteMany({ user: userId }),
    Habit.default.deleteMany({ user: userId }),
    Notification.default.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ])

  return sendSuccess(res, { message: 'Account deleted successfully.' })
})

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  return sendSuccess(res, { message: 'Logged out successfully.' })
})
