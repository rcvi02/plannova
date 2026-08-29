import Task from '../models/Task.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess, sendError, paginationMeta } from '../utils/apiResponse.js'
import { format, addDays } from 'date-fns'

const buildTaskQuery = (userId, queryParams) => {
  const { status, priority, subject, dueDate, search, taskType } = queryParams
  const query = { user: userId }
  if (status) query.status = status
  if (priority) query.priority = priority
  if (subject) query.subject = subject
  if (dueDate) query.dueDate = dueDate
  if (taskType) query.taskType = taskType
  if (search) query.$text = { $search: search }
  return query
}

// GET /api/tasks
export const getTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, sort = '-createdAt', ...filters } = req.query
  const query = buildTaskQuery(req.user._id, filters)
  const skip = (page - 1) * limit

  const [tasks, total] = await Promise.all([
    Task.find(query).sort(sort).skip(skip).limit(parseInt(limit)).populate('subject', 'name color icon'),
    Task.countDocuments(query),
  ])

  return sendSuccess(res, {
    message: 'Tasks retrieved.',
    data: { tasks },
    pagination: paginationMeta({ page, limit, total }),
  })
})

// GET /api/tasks/today
export const getTodayTasks = asyncHandler(async (req, res) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const tasks = await Task.find({ user: req.user._id, dueDate: today })
    .sort('order')
    .populate('subject', 'name color icon')
  return sendSuccess(res, { message: 'Today tasks.', data: { tasks } })
})

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id })
  await task.populate('subject', 'name color icon')
  return sendSuccess(res, { message: 'Task created.', data: { task }, statusCode: 201 })
})

// GET /api/tasks/:id
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id }).populate('subject', 'name color icon')
  if (!task) return sendError(res, { message: 'Task not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Task retrieved.', data: { task } })
})

// PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  ).populate('subject', 'name color icon')
  if (!task) return sendError(res, { message: 'Task not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Task updated.', data: { task } })
})

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!task) return sendError(res, { message: 'Task not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Task deleted.' })
})

// PUT /api/tasks/:id/toggle
export const toggleTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
  if (!task) return sendError(res, { message: 'Task not found.', statusCode: 404 })
  task.status = task.status === 'completed' ? 'pending' : 'completed'
  task.completedAt = task.status === 'completed' ? new Date() : null
  await task.save()
  return sendSuccess(res, { message: 'Task toggled.', data: { task } })
})

// POST /api/tasks/bulk
export const bulkAction = asyncHandler(async (req, res) => {
  const { action, ids, status } = req.body
  if (!ids?.length) return sendError(res, { message: 'No task IDs provided.', statusCode: 400 })

  if (action === 'delete') {
    await Task.deleteMany({ _id: { $in: ids }, user: req.user._id })
    return sendSuccess(res, { message: `${ids.length} tasks deleted.` })
  }

  if (action === 'updateStatus' && status) {
    await Task.updateMany(
      { _id: { $in: ids }, user: req.user._id },
      { status, completedAt: status === 'completed' ? new Date() : null }
    )
    return sendSuccess(res, { message: `${ids.length} tasks updated.` })
  }

  return sendError(res, { message: 'Invalid bulk action.', statusCode: 400 })
})

// PUT /api/tasks/:id/reschedule
export const rescheduleTask = asyncHandler(async (req, res) => {
  const { dueDate } = req.body
  if (!dueDate) return sendError(res, { message: 'dueDate is required.', statusCode: 400 })
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { dueDate, status: 'pending' },
    { new: true }
  )
  if (!task) return sendError(res, { message: 'Task not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Task rescheduled.', data: { task } })
})

// Auto-mark overdue tasks as missed (called by cron job)
export const markMissedTasks = async () => {
  const yesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd')
  const result = await Task.updateMany(
    { status: 'pending', dueDate: { $lt: yesterday } },
    { status: 'missed' }
  )
  console.log(`✅ Marked ${result.modifiedCount} tasks as missed.`)
  return result.modifiedCount
}
