import mongoose from 'mongoose'

const syllabusTopicSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
}, { _id: true })

const examSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: [true, 'Exam name is required'], trim: true, maxlength: 150 },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
  date: { type: String, required: [true, 'Exam date is required'], index: true },
  examTime: { type: String, default: null },
  location: { type: String, trim: true, maxlength: 150, default: '' },
  totalMarks: { type: Number, default: 100, min: 0 },
  targetMarks: { type: Number, default: 80, min: 0 },
  syllabusTopics: { type: [syllabusTopicSchema], default: [] },
  preparationProgress: { type: Number, default: 0, min: 0, max: 100 },
  readinessScore: { type: Number, default: 0, min: 0, max: 100 },
  notes: { type: String, trim: true, maxlength: 1000, default: '' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'high' },
  status: { type: String, enum: ['upcoming', 'completed', 'missed'], default: 'upcoming' },
}, { timestamps: true })

examSchema.index({ user: 1, date: 1 })
examSchema.index({ user: 1, status: 1 })
examSchema.index({ user: 1, name: 'text' })

const Exam = mongoose.model('Exam', examSchema)
export default Exam
