import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: ['task', 'exam', 'revision', 'habit', 'goal', 'system'],
    default: 'system',
  },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  message: { type: String, required: true, trim: true, maxlength: 500 },
  read: { type: Boolean, default: false, index: true },
  link: { type: String, default: null },
  relatedId: { type: mongoose.Schema.Types.ObjectId, default: null },
  relatedModel: { type: String, default: null },
}, { timestamps: true })

notificationSchema.index({ user: 1, read: 1, createdAt: -1 })

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
