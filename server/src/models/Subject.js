import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: [true, 'Subject name is required'], trim: true, maxlength: 80 },
  code: { type: String, trim: true, maxlength: 20, default: '' },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  color: { type: String, default: '#7C3AED' },
  colorSoft: { type: String, default: '#EDE9FE' },
  icon: { type: String, default: '📚' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  targetHours: { type: Number, default: 0, min: 0 },
  studyHours: { type: Number, default: 0, min: 0 },
  totalChapters: { type: Number, default: 0, min: 0 },
  completedChapters: { type: Number, default: 0, min: 0 },
  totalTopics: { type: Number, default: 0, min: 0 },
  completedTopics: { type: Number, default: 0, min: 0 },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  archived: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

subjectSchema.index({ user: 1, archived: 1 })
subjectSchema.index({ user: 1, priority: 1 })
subjectSchema.index({ user: 1, name: 'text' })

// Auto-calculate progress
subjectSchema.pre('save', function (next) {
  if (this.totalChapters > 0) {
    this.progress = Math.round((this.completedChapters / this.totalChapters) * 100)
  } else {
    this.progress = 0
  }
  next()
})

const Subject = mongoose.model('Subject', subjectSchema)
export default Subject
