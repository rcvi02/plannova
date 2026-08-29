import StudySession from '../models/StudySession.js'
import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess, sendError, paginationMeta } from '../utils/apiResponse.js'
import { format, startOfWeek, endOfWeek, subDays } from 'date-fns'

// GET /api/study-sessions
export const getSessions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, subject, date, sort = '-date' } = req.query
  const query = { user: req.user._id }
  if (subject) query.subject = subject
  if (date) query.date = date

  const skip = (page - 1) * limit
  const [sessions, total] = await Promise.all([
    StudySession.find(query).sort(sort).skip(skip).limit(parseInt(limit)).populate('subject', 'name color icon'),
    StudySession.countDocuments(query),
  ])

  return sendSuccess(res, {
    message: 'Sessions retrieved.',
    data: { sessions },
    pagination: paginationMeta({ page, limit, total }),
  })
})

// POST /api/study-sessions
export const createSession = asyncHandler(async (req, res) => {
  const { date, duration, subject } = req.body
  
  const session = await StudySession.create({ ...req.body, user: req.user._id })
  await session.populate('subject', 'name color icon')

  // Update subject study hours
  if (subject) {
    const Subject = (await import('../models/Subject.js')).default
    await Subject.findByIdAndUpdate(subject, { $inc: { studyHours: Math.round(duration / 60 * 10) / 10 } })
  }

  // Update user total study minutes and streak
  await updateUserStudyStreak(req.user._id, date, duration)

  return sendSuccess(res, { message: 'Session saved.', data: { session }, statusCode: 201 })
})

// PUT /api/study-sessions/:id
export const updateSession = asyncHandler(async (req, res) => {
  const session = await StudySession.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  ).populate('subject', 'name color icon')
  if (!session) return sendError(res, { message: 'Session not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Session updated.', data: { session } })
})

// DELETE /api/study-sessions/:id
export const deleteSession = asyncHandler(async (req, res) => {
  const session = await StudySession.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!session) return sendError(res, { message: 'Session not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Session deleted.' })
})

// GET /api/study-sessions/stats
export const getSessionStats = asyncHandler(async (req, res) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')

  const [todaySessions, weekSessions, monthSessions] = await Promise.all([
    StudySession.find({ user: req.user._id, date: today }),
    StudySession.find({ user: req.user._id, date: { $gte: weekStart } }),
    StudySession.find({ user: req.user._id, date: { $gte: monthStart } }),
  ])

  const sum = arr => arr.reduce((a, s) => a + s.duration, 0)
  const avgFocus = arr => arr.length ? Math.round(arr.reduce((a, s) => a + s.focusRating, 0) / arr.length * 10) / 10 : 0

  return sendSuccess(res, {
    message: 'Session stats.',
    data: {
      todayMinutes: sum(todaySessions),
      weekMinutes: sum(weekSessions),
      monthMinutes: sum(monthSessions),
      averageFocus: avgFocus(weekSessions),
      sessionCount: weekSessions.length,
    },
  })
})

const updateUserStudyStreak = async (userId, dateStr, durationMinutes) => {
  const user = await User.findById(userId)
  if (!user) return

  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  user.totalStudyMinutes = (user.totalStudyMinutes || 0) + durationMinutes

  if (user.lastStudyDate !== today) {
    if (user.lastStudyDate === yesterday) {
      user.streak = (user.streak || 0) + 1
    } else if (user.lastStudyDate !== today) {
      user.streak = 1
    }
    user.lastStudyDate = today
    if (user.streak > (user.longestStreak || 0)) user.longestStreak = user.streak
  }

  await user.save({ validateBeforeSave: false })
}
