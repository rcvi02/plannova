import Revision, { SPACED_INTERVALS } from '../models/Revision.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess, sendError, paginationMeta } from '../utils/apiResponse.js'
import { format, addDays } from 'date-fns'

const getStatus = (dateStr) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  if (dateStr < today) return 'overdue'
  if (dateStr === today) return 'due'
  return 'upcoming'
}

// GET /api/revisions
export const getRevisions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 100, status, subject, sort = 'dueDate' } = req.query
  const query = { user: req.user._id }
  if (status && status !== 'all') query.status = status
  if (subject) query.subject = subject

  const skip = (page - 1) * limit
  const [revisions, total] = await Promise.all([
    Revision.find(query).sort(sort).skip(skip).limit(parseInt(limit)).populate('subject', 'name color icon'),
    Revision.countDocuments(query),
  ])

  return sendSuccess(res, {
    message: 'Revisions retrieved.',
    data: { revisions },
    pagination: paginationMeta({ page, limit, total }),
  })
})

// POST /api/revisions
export const createRevision = asyncHandler(async (req, res) => {
  const { topic, subject, dueDate, confidenceBefore, notes } = req.body

  // Prevent duplicate for same topic and date
  const existing = await Revision.findOne({
    user: req.user._id,
    topicTitle: topic,
    dueDate,
    completed: false,
  })
  if (existing) {
    return sendError(res, { message: 'A pending revision for this topic already exists.', statusCode: 409 })
  }

  const status = getStatus(dueDate)
  const revision = await Revision.create({
    user: req.user._id,
    topicTitle: topic,
    subject: subject || null,
    dueDate,
    scheduledDate: dueDate,
    confidenceBefore: confidenceBefore || 3,
    notes: notes || '',
    status,
  })
  await revision.populate('subject', 'name color icon')

  return sendSuccess(res, { message: 'Revision created.', data: { revision }, statusCode: 201 })
})

// PUT /api/revisions/:id/complete
export const completeRevision = asyncHandler(async (req, res) => {
  const { confidenceAfter } = req.body
  const revision = await Revision.findOne({ _id: req.params.id, user: req.user._id })
  if (!revision) return sendError(res, { message: 'Revision not found.', statusCode: 404 })

  const confidence = confidenceAfter || 3
  const intervalIndex = Math.min(revision.revisionNumber - 1, SPACED_INTERVALS.length - 1)
  // Adjust interval based on confidence (lower confidence = shorter interval)
  let daysToAdd = SPACED_INTERVALS[intervalIndex]
  if (confidence <= 2) daysToAdd = Math.max(1, Math.floor(daysToAdd / 2))
  if (confidence === 5) daysToAdd = SPACED_INTERVALS[Math.min(intervalIndex + 1, SPACED_INTERVALS.length - 1)]

  const nextDate = format(addDays(new Date(), daysToAdd), 'yyyy-MM-dd')
  const today = format(new Date(), 'yyyy-MM-dd')

  revision.completed = true
  revision.status = 'completed'
  revision.completedDate = today
  revision.confidenceAfter = confidence
  revision.nextRevisionDate = nextDate
  revision.revisionNumber += 1
  await revision.save()

  // Create next revision automatically
  const nextRevision = await Revision.create({
    user: req.user._id,
    topicTitle: revision.topicTitle,
    subject: revision.subject,
    dueDate: nextDate,
    scheduledDate: nextDate,
    revisionNumber: revision.revisionNumber,
    confidenceBefore: confidence,
    status: getStatus(nextDate),
  })

  return sendSuccess(res, {
    message: `Revision completed! Next review in ${daysToAdd} days.`,
    data: { revision, nextRevision },
  })
})

// PUT /api/revisions/:id/reschedule
export const rescheduleRevision = asyncHandler(async (req, res) => {
  const { date } = req.body
  if (!date) return sendError(res, { message: 'Date is required.', statusCode: 400 })

  const revision = await Revision.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { dueDate: date, scheduledDate: date, status: getStatus(date) },
    { new: true }
  )
  if (!revision) return sendError(res, { message: 'Revision not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Revision rescheduled.', data: { revision } })
})

// DELETE /api/revisions/:id
export const deleteRevision = asyncHandler(async (req, res) => {
  const revision = await Revision.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!revision) return sendError(res, { message: 'Revision not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Revision deleted.' })
})

// Update statuses (called by cron)
export const updateRevisionStatuses = async () => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd')

  await Promise.all([
    Revision.updateMany({ dueDate: { $lt: today }, completed: false }, { status: 'overdue' }),
    Revision.updateMany({ dueDate: today, completed: false }, { status: 'due' }),
    Revision.updateMany({ dueDate: { $gt: today }, completed: false }, { status: 'upcoming' }),
  ])
  console.log('✅ Revision statuses updated.')
}
