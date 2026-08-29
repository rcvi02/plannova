import mongoose from 'mongoose'

const topicSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', default: null },
  title: { type: String, required: [true, 'Topic title is required'], trim: true, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  estimatedMinutes: { type: Number, default: 30, min: 1 },
  actualMinutes: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  confidenceLevel: { type: Number, default: 0, min: 0, max: 5 },
  completedAt: { type: Date, default: null },
  revisionRequired: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

topicSchema.index({ user: 1, subject: 1 })
topicSchema.index({ user: 1, chapter: 1 })
topicSchema.index({ user: 1, status: 1 })

const Topic = mongoose.model('Topic', topicSchema)
export default Topic
