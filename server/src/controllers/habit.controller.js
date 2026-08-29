import Habit from '../models/Habit.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess, sendError, paginationMeta } from '../utils/apiResponse.js'
import { format } from 'date-fns'

// GET /api/habits
export const getHabits = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, active = 'true' } = req.query
  const query = { user: req.user._id }
  if (active !== 'all') query.active = active === 'true'

  const skip = (page - 1) * limit
  const [habits, total] = await Promise.all([
    Habit.find(query).sort('-createdAt').skip(skip).limit(parseInt(limit)),
    Habit.countDocuments(query),
  ])

  return sendSuccess(res, {
    message: 'Habits retrieved.',
    data: { habits },
    pagination: paginationMeta({ page, limit, total }),
  })
})

// POST /api/habits
export const createHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.create({ ...req.body, user: req.user._id })
  return sendSuccess(res, { message: 'Habit created.', data: { habit }, statusCode: 201 })
})

// GET /api/habits/:id
export const getHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id })
  if (!habit) return sendError(res, { message: 'Habit not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Habit retrieved.', data: { habit } })
})

// PUT /api/habits/:id
export const updateHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  )
  if (!habit) return sendError(res, { message: 'Habit not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Habit updated.', data: { habit } })
})

// DELETE /api/habits/:id
export const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!habit) return sendError(res, { message: 'Habit not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Habit deleted.' })
})

// POST /api/habits/:id/toggle
export const toggleHabitToday = asyncHandler(async (req, res) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const { date } = req.body
  const targetDate = date || today

  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id })
  if (!habit) return sendError(res, { message: 'Habit not found.', statusCode: 404 })

  const alreadyDone = habit.isCompletedOn(targetDate)
  if (alreadyDone) {
    // Unmark
    habit.completionHistory = habit.completionHistory.filter(e => e.date !== targetDate)
  } else {
    // Mark
    habit.completionHistory.push({ date: targetDate, value: 1 })
    habit.completionHistory.sort((a, b) => a.date.localeCompare(b.date))
  }

  habit.recalculateStreak()
  await habit.save()

  return sendSuccess(res, {
    message: alreadyDone ? 'Habit unmarked.' : 'Habit completed! 🔥',
    data: { habit },
  })
})
