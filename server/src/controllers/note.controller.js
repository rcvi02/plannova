import Note from '../models/Note.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess, sendError, paginationMeta } from '../utils/apiResponse.js'

// GET /api/notes
export const getNotes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, subject, search, isPinned, isFavorite, sort = '-updatedAt' } = req.query
  const query = { user: req.user._id }
  if (subject) query.subject = subject
  if (isPinned === 'true') query.isPinned = true
  if (isFavorite === 'true') query.isFavorite = true
  if (search) query.$text = { $search: search }

  const skip = (page - 1) * limit
  const [notes, total] = await Promise.all([
    Note.find(query).sort(sort).skip(skip).limit(parseInt(limit)).populate('subject', 'name color icon'),
    Note.countDocuments(query),
  ])

  return sendSuccess(res, {
    message: 'Notes retrieved.',
    data: { notes },
    pagination: paginationMeta({ page, limit, total }),
  })
})

// POST /api/notes
export const createNote = asyncHandler(async (req, res) => {
  const note = await Note.create({ ...req.body, user: req.user._id })
  await note.populate('subject', 'name color icon')
  return sendSuccess(res, { message: 'Note created.', data: { note }, statusCode: 201 })
})

// GET /api/notes/:id
export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id }).populate('subject', 'name color icon')
  if (!note) return sendError(res, { message: 'Note not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Note retrieved.', data: { note } })
})

// PUT /api/notes/:id
export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  ).populate('subject', 'name color icon')
  if (!note) return sendError(res, { message: 'Note not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Note updated.', data: { note } })
})

// DELETE /api/notes/:id
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!note) return sendError(res, { message: 'Note not found.', statusCode: 404 })
  return sendSuccess(res, { message: 'Note deleted.' })
})

// PUT /api/notes/:id/pin
export const togglePin = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id })
  if (!note) return sendError(res, { message: 'Note not found.', statusCode: 404 })
  note.isPinned = !note.isPinned
  await note.save()
  return sendSuccess(res, { message: note.isPinned ? 'Note pinned.' : 'Note unpinned.', data: { note } })
})

// PUT /api/notes/:id/favorite
export const toggleFavorite = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id })
  if (!note) return sendError(res, { message: 'Note not found.', statusCode: 404 })
  note.isFavorite = !note.isFavorite
  await note.save()
  return sendSuccess(res, { message: 'Note favorite toggled.', data: { note } })
})
