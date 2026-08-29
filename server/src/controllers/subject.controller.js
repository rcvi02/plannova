import Subject from '../models/Subject.js'
import Chapter from '../models/Chapter.js'
import Topic from '../models/Topic.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess, sendError, paginationMeta } from '../utils/apiResponse.js'

// GET /api/subjects
export const getSubjects = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, search, priority, archived = 'false', sort = '-createdAt' } = req.query

  const query = { user: req.user._id }
  if (archived === 'true') query.archived = true
  else query.archived = false
  if (priority) query.priority = priority
  if (search) query.$text = { $search: search }

  const skip = (page - 1) * limit
  const [subjects, total] = await Promise.all([
    Subject.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
    Subject.countDocuments(query),
  ])

  return sendSuccess(res, {
    message: 'Subjects retrieved.',
    data: { subjects },
    pagination: paginationMeta({ page, limit, total }),
  })
})

// POST /api/subjects
export const createSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create({ ...req.body, user: req.user._id })
  return sendSuccess(res, { message: 'Subject created.', data: { subject }, statusCode: 201 })
})

// GET /api/subjects/:id
export const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id })
  if (!subject) return sendError(res, { message: 'Subject not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Subject retrieved.', data: { subject } })
})

// PUT /api/subjects/:id
export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  )
  if (!subject) return sendError(res, { message: 'Subject not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Subject updated.', data: { subject } })
})

// DELETE /api/subjects/:id
export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!subject) return sendError(res, { message: 'Subject not found.', statusCode: 404 })
  // Cascade delete chapters and topics
  await Promise.all([
    Chapter.deleteMany({ subject: req.params.id, user: req.user._id }),
    Topic.deleteMany({ subject: req.params.id, user: req.user._id }),
  ])
  return sendSuccess(res, { message: 'Subject deleted.' })
})

// PUT /api/subjects/:id/archive
export const archiveSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { archived: true },
    { new: true }
  )
  if (!subject) return sendError(res, { message: 'Subject not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Subject archived.', data: { subject } })
})

// PUT /api/subjects/:id/restore
export const restoreSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { archived: false },
    { new: true }
  )
  if (!subject) return sendError(res, { message: 'Subject not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Subject restored.', data: { subject } })
})

// GET /api/subjects/:id/stats
export const getSubjectStats = asyncHandler(async (req, res) => {
  const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id })
  if (!subject) return sendError(res, { message: 'Subject not found.', statusCode: 404 })

  const [chapters, topics] = await Promise.all([
    Chapter.find({ subject: subject._id, user: req.user._id }),
    Topic.find({ subject: subject._id, user: req.user._id }),
  ])

  const stats = {
    totalChapters: chapters.length,
    completedChapters: chapters.filter(c => c.status === 'completed').length,
    totalTopics: topics.length,
    completedTopics: topics.filter(t => t.status === 'completed').length,
    studyHours: subject.studyHours,
    progress: subject.progress,
  }

  return sendSuccess(res, { message: 'Subject stats.', data: { stats, subject } })
})

// Helper: recalculate subject progress from chapters
export const recalculateSubjectProgress = async (subjectId, userId) => {
  const [chapters, topics] = await Promise.all([
    Chapter.find({ subject: subjectId, user: userId }),
    Topic.find({ subject: subjectId, user: userId }),
  ])

  const completedChapters = chapters.filter(c => c.status === 'completed').length
  const completedTopics = topics.filter(t => t.status === 'completed').length

  await Subject.findByIdAndUpdate(subjectId, {
    totalChapters: chapters.length,
    completedChapters,
    totalTopics: topics.length,
    completedTopics,
    progress: chapters.length > 0 ? Math.round((completedChapters / chapters.length) * 100) : 0,
  })
}
