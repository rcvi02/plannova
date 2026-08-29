import mongoose from 'mongoose'

const completionEntrySchema = new mongoose.Schema({
  date: { type: String, required: true },
  value: { type: Number, default: 1 },
}, { _id: false })

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: [true, 'Habit name is required'], trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 300, default: '' },
  icon: { type: String, default: '⭐' },
  color: { type: String, default: '#7C3AED' },
  frequency: { type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily' },
  targetDays: [{ type: String, enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] }],
  targetValue: { type: Number, default: 1, min: 1 },
  unit: { type: String, default: 'times', maxlength: 20 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  completionHistory: { type: [completionEntrySchema], default: [] },
  active: { type: Boolean, default: true },
  archived: { type: Boolean, default: false },
}, { timestamps: true })

habitSchema.methods.isCompletedOn = function (dateStr) {
  return this.completionHistory.some(e => e.date === dateStr)
}

habitSchema.methods.recalculateStreak = function () {
  const dates = this.completionHistory.map(e => e.date).sort()
  if (dates.length === 0) { this.currentStreak = 0; return }

  let streak = 1
  const today = new Date().toISOString().split('T')[0]
  const latestDate = dates[dates.length - 1]

  // If latest completion isn't today or yesterday, streak is 0
  const diff = Math.floor((new Date(today) - new Date(latestDate)) / 86400000)
  if (diff > 1) { this.currentStreak = 0; return }

  for (let i = dates.length - 1; i > 0; i--) {
    const curr = new Date(dates[i])
    const prev = new Date(dates[i - 1])
    const dayDiff = Math.floor((curr - prev) / 86400000)
    if (dayDiff === 1) streak++
    else break
  }

  this.currentStreak = streak
  if (streak > this.longestStreak) this.longestStreak = streak
}

habitSchema.index({ user: 1, active: 1 })

const Habit = mongoose.model('Habit', habitSchema)
export default Habit
