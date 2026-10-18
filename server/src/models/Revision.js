import mongoose from 'mongoose'

const SPACED_INTERVALS = [1, 3, 7, 15, 30] // days

const revisionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', default: null },
  topicRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
  topic: { type: String, trim: true, maxlength: 200 },
  topicTitle: { type: String, required: [true, 'Topic is required'], trim: true, maxlength: 200 },
  revisionNumber: { type: Number, default: 1, min: 1 },
  scheduledDate: { type: String, required: [true, 'Scheduled date is required'], index: true },
  dueDate: { type: String, required: true }, // same as scheduledDate, for frontend compat
  completedDate: { type: String, default: null },
  completed: { type: Boolean, default: false },
  confidenceBefore: { type: Number, default: 3, min: 1, max: 5 },
  confidenceAfter: { type: Number, default: null, min: 1, max: 5 },
  nextRevisionDate: { type: String, default: null },
  status: { type: String, enum: ['due', 'overdue', 'upcoming', 'completed'], default: 'upcoming' },
  notes: { type: String, trim: true, maxlength: 500, default: '' },
}, { timestamps: true })

revisionSchema.pre('save', function (next) {
  if (this.topic && !this.topicTitle) this.topicTitle = this.topic
  if (this.topicTitle && !this.topic) this.topic = this.topicTitle
  next()
})

revisionSchema.virtual('confidence').get(function () { return this.confidenceAfter || this.confidenceBefore })
revisionSchema.virtual('subjectId').get(function () { return this.subject?._id || this.subject })
revisionSchema.set('toJSON', { virtuals: true })
revisionSchema.set('toObject', { virtuals: true })

revisionSchema.index({ user: 1, scheduledDate: 1 })
revisionSchema.index({ user: 1, status: 1 })
revisionSchema.index({ user: 1, subject: 1 })

const Revision = mongoose.model('Revision', revisionSchema)
export default Revision
export { SPACED_INTERVALS }
