import mongoose from 'mongoose'

const attachmentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: null },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
}, { _id: true, timestamps: true })

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', default: null },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
  title: { type: String, required: [true, 'Note title is required'], trim: true, maxlength: 200 },
  content: { type: String, default: '' }, // Rich text HTML
  plainTextContent: { type: String, default: '' }, // For search
  tags: [{ type: String, trim: true, maxlength: 30 }],
  isPinned: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  attachments: { type: [attachmentSchema], default: [] },
}, { timestamps: true })

noteSchema.index({ user: 1, isPinned: -1, updatedAt: -1 })
noteSchema.index({ user: 1, subject: 1 })
noteSchema.index({ user: 1, title: 'text', plainTextContent: 'text', tags: 'text' })

const Note = mongoose.model('Note', noteSchema)
export default Note
