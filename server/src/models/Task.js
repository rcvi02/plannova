import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: [true, 'Task title is required'], trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', default: null },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
  taskType: {
    type: String,
    enum: ['study', 'revision', 'practice', 'mock-test', 'assignment', 'notes', 'video-lecture', 'pyq', 'other'],
    default: 'study',
  },
  dueDate: { type: String, required: [true, 'Due date is required'], index: true },
  startTime: { type: String, default: null },
  endTime: { type: String, default: null },
  estimatedTime: { type: Number, default: 30, min: 1 }, // in minutes
  actualMinutes: { type: Number, default: 0 },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium', index: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'missed'], default: 'pending', index: true },
  repeatType: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
  repeatDays: [{ type: String, enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] }],
  reminderMinutes: { type: Number, default: 0 },
  tags: [{ type: String, trim: true, maxlength: 30 }],
  completedAt: { type: Date, default: null },
  order: { type: Number, default: 0 },
  parentTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
}, { timestamps: true })

taskSchema.index({ user: 1, dueDate: 1 })
taskSchema.index({ user: 1, status: 1 })
taskSchema.index({ user: 1, subject: 1 })
taskSchema.index({ user: 1, priority: 1 })
taskSchema.index({ user: 1, title: 'text', description: 'text', tags: 'text' })

const Task = mongoose.model('Task', taskSchema)
export default Task
