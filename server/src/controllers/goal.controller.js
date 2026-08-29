import Goal from '../models/Goal.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess, sendError, paginationMeta } from '../utils/apiResponse.js'
import { format } from 'date-fns'

// GET /api/goals
export const getGoals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status, goalType, sort = '-createdAt' } = req.query
  const query = { user: req.user._id }
  if (status) query.status = status
  if (goalType) query.goalType = goalType

  const skip = (page - 1) * limit
  const [goals, total] = await Promise.all([
    Goal.find(query).sort(sort).skip(skip).limit(parseInt(limit)).populate('subject', 'name color icon'),
    Goal.countDocuments(query),
  ])

  return sendSuccess(res, {
    message: 'Goals retrieved.',
    data: { goals },
    pagination: paginationMeta({ page, limit, total }),
  })
})

// POST /api/goals
export const createGoal = asyncHandler(async (req, res) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const goal = await Goal.create({ ...req.body, user: req.user._id, startDate: req.body.startDate || today })
  await goal.populate('subject', 'name color icon')
  return sendSuccess(res, { message: 'Goal created.', data: { goal }, statusCode: 201 })
})

// GET /api/goals/:id
export const getGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id }).populate('subject', 'name color icon')
  if (!goal) return sendError(res, { message: 'Goal not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Goal retrieved.', data: { goal } })
})

// PUT /api/goals/:id
export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  ).populate('subject', 'name color icon')
  if (!goal) return sendError(res, { message: 'Goal not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Goal updated.', data: { goal } })
})

// DELETE /api/goals/:id
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!goal) return sendError(res, { message: 'Goal not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Goal deleted.' })
})

// PUT /api/goals/:id/progress
export const updateGoalProgress = asyncHandler(async (req, res) => {
  const { current } = req.body
  if (current === undefined) return sendError(res, { message: 'current value is required.', statusCode: 400 })

  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id })
  if (!goal) return sendError(res, { message: 'Goal not found.', statusCode: 404 })

  goal.current = current
  await goal.save()

  return sendSuccess(res, { message: 'Goal progress updated.', data: { goal } })
})
