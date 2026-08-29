import Notification from '../models/Notification.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess, sendError, paginationMeta } from '../utils/apiResponse.js'

// GET /api/notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, read } = req.query
  const query = { user: req.user._id }
  if (read === 'true') query.read = true
  if (read === 'false') query.read = false

  const skip = (page - 1) * limit
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query).sort('-createdAt').skip(skip).limit(parseInt(limit)),
    Notification.countDocuments(query),
    Notification.countDocuments({ user: req.user._id, read: false }),
  ])

  return sendSuccess(res, {
    message: 'Notifications retrieved.',
    data: { notifications, unreadCount },
    pagination: paginationMeta({ page, limit, total }),
  })
})

// PUT /api/notifications/:id/read
export const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  )
  if (!notification) return sendError(res, { message: 'Notification not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Notification marked as read.', data: { notification } })
})

// PUT /api/notifications/read-all
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true })
  return sendSuccess(res, { message: 'All notifications marked as read.' })
})

// DELETE /api/notifications/:id
export const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  return sendSuccess(res, { message: 'Notification deleted.' })
})

// Helper: create a notification
export const createNotification = async ({ userId, type, title, message, link, relatedId, relatedModel }) => {
  return Notification.create({ user: userId, type, title, message, link, relatedId, relatedModel })
}
