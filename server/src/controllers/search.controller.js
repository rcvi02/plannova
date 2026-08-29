import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import Subject from '../models/Subject.js'
import Task from '../models/Task.js'
import Exam from '../models/Exam.js'
import Note from '../models/Note.js'

// GET /api/search?q=...
export const globalSearch = asyncHandler(async (req, res) => {
  const { q, limit = 5 } = req.query
  if (!q || q.trim().length < 2) {
    return sendSuccess(res, { message: 'Search results.', data: { results: {} } })
  }

  const searchRegex = new RegExp(q.trim(), 'i')
  const userId = req.user._id
  const lim = parseInt(limit)

  const [subjects, tasks, exams, notes] = await Promise.all([
    Subject.find({ user: userId, archived: false, name: searchRegex }).limit(lim).select('name color icon'),
    Task.find({ user: userId, $or: [{ title: searchRegex }, { tags: searchRegex }] }).limit(lim).select('title dueDate priority status').populate('subject', 'name color'),
    Exam.find({ user: userId, name: searchRegex }).limit(lim).select('name date status priority').populate('subject', 'name color'),
    Note.find({ user: userId, $or: [{ title: searchRegex }, { plainTextContent: searchRegex }] }).limit(lim).select('title tags updatedAt').populate('subject', 'name color'),
  ])

  const total = subjects.length + tasks.length + exams.length + notes.length

  return sendSuccess(res, {
    message: 'Search results.',
    data: {
      results: { subjects, tasks, exams, notes },
      total,
      query: q,
    },
  })
})
