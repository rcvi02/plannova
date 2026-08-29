import mongoose from 'mongoose'

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
}, { _id: true })

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: [true, 'Goal title is required'], trim: true, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  goalType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'subject', 'exam', 'custom'],
    default: 'custom',
  },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
  targetValue: { type: Number, required: [true, 'Target value is required'], min: 1 },
  current: { type: Number, default: 0, min: 0 },
  unit: { type: String, trim: true, maxlength: 30, default: 'tasks' },
  startDate: { type: String, required: true },
  targetDate: { type: String, required: [true, 'Target date is required'] },
  deadline: { type: String }, // alias
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active', index: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  milestones: { type: [milestoneSchema], default: [] },
  completedAt: { type: Date, default: null },
}, { timestamps: true })

goalSchema.pre('save', function (next) {
  if (this.targetValue > 0) {
    this.progress = Math.min(Math.round((this.current / this.targetValue) * 100), 100)
  }
  if (!this.deadline) this.deadline = this.targetDate
  if (this.progress >= 100 && this.status === 'active') {
    this.status = 'completed'
    this.completedAt = new Date()
  }
  next()
})

goalSchema.index({ user: 1, status: 1 })
goalSchema.index({ user: 1, goalType: 1 })

const Goal = mongoose.model('Goal', goalSchema)
export default Goal
