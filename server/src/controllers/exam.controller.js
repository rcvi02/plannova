import Exam from '../models/Exam.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess, sendError, paginationMeta } from '../utils/apiResponse.js'
import { format } from 'date-fns'

// GET /api/exams
export const getExams = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status, subject, sort = 'date' } = req.query
  const query = { user: req.user._id }
  if (status) query.status = status
  if (subject) query.subject = subject

  const skip = (page - 1) * limit
  const [exams, total] = await Promise.all([
    Exam.find(query).sort(sort).skip(skip).limit(parseInt(limit)).populate('subject', 'name color icon'),
    Exam.countDocuments(query),
  ])

  return sendSuccess(res, {
    message: 'Exams retrieved.',
    data: { exams },
    pagination: paginationMeta({ page, limit, total }),
  })
})

// POST /api/exams
export const createExam = asyncHandler(async (req, res) => {
  const exam = await Exam.create({ ...req.body, user: req.user._id })
  await exam.populate('subject', 'name color icon')
  return sendSuccess(res, { message: 'Exam created.', data: { exam }, statusCode: 201 })
})

// GET /api/exams/:id
export const getExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findOne({ _id: req.params.id, user: req.user._id }).populate('subject', 'name color icon')
  if (!exam) return sendError(res, { message: 'Exam not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Exam retrieved.', data: { exam } })
})

// PUT /api/exams/:id
export const updateExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  ).populate('subject', 'name color icon')
  if (!exam) return sendError(res, { message: 'Exam not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Exam updated.', data: { exam } })
})

// DELETE /api/exams/:id
export const deleteExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!exam) return sendError(res, { message: 'Exam not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Exam deleted.' })
})

// PUT /api/exams/:id/syllabus/:topicId
export const toggleSyllabusTopic = asyncHandler(async (req, res) => {
  const exam = await Exam.findOne({ _id: req.params.id, user: req.user._id })
  if (!exam) return sendError(res, { message: 'Exam not found.', statusCode: 404 })

  const topic = exam.syllabusTopics.id(req.params.topicId)
  if (!topic) return sendError(res, { message: 'Syllabus topic not found.', statusCode: 404 })

  topic.completed = !topic.completed
  const completedCount = exam.syllabusTopics.filter(t => t.completed).length
  exam.preparationProgress = exam.syllabusTopics.length > 0
    ? Math.round((completedCount / exam.syllabusTopics.length) * 100) : 0

  await exam.save()
  return sendSuccess(res, { message: 'Syllabus topic updated.', data: { exam } })
})
