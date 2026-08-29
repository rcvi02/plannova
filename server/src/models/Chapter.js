import mongoose from 'mongoose'

const chapterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  title: { type: String, required: [true, 'Chapter title is required'], trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  totalTopics: { type: Number, default: 0 },
  completedTopics: { type: Number, default: 0 },
}, { timestamps: true })

chapterSchema.index({ user: 1, subject: 1 })
chapterSchema.index({ subject: 1, order: 1 })

const Chapter = mongoose.model('Chapter', chapterSchema)
export default Chapter
