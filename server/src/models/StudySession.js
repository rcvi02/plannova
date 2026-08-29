import mongoose from 'mongoose'

const studySessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', default: null },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
  sessionType: { type: String, enum: ['pomodoro', 'manual', 'stopwatch'], default: 'manual' },
  date: { type: String, required: [true, 'Session date is required'], index: true },
  startTime: { type: String, default: null },
  endTime: { type: String, default: null },
  duration: { type: Number, required: [true, 'Duration is required'], min: 1 }, // in minutes
  breakMinutes: { type: Number, default: 0, min: 0 },
  focusRating: { type: Number, default: 3, min: 1, max: 5 },
  productivityRating: { type: Number, default: 3, min: 1, max: 5 },
  topic_description: { type: String, trim: true, maxlength: 200, default: '' },
  notes: { type: String, trim: true, maxlength: 500, default: '' },
  completed: { type: Boolean, default: true },
}, { timestamps: true })

// Alias for frontend compatibility (uses `topic` as a string in some places)
studySessionSchema.virtual('rating').get(function () {
  return this.focusRating
})

studySessionSchema.index({ user: 1, date: -1 })
studySessionSchema.index({ user: 1, subject: 1 })

const StudySession = mongoose.model('StudySession', studySessionSchema)
export default StudySession
