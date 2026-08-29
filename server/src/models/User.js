import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const notificationPreferencesSchema = new mongoose.Schema({
  taskReminders: { type: Boolean, default: true },
  examReminders: { type: Boolean, default: true },
  revisionReminders: { type: Boolean, default: true },
  habitReminders: { type: Boolean, default: true },
  goalReminders: { type: Boolean, default: true },
  emailNotifications: { type: Boolean, default: false },
}, { _id: false })

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [60, 'Name must be at most 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [function() { return !this.googleId }, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  profileImage: { type: String, default: null },
  profileImagePublicId: { type: String, default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // Academic info
  course: { type: String, default: '' },
  college: { type: String, default: '' },
  semester: { type: String, default: '' },
  timezone: { type: String, default: 'Asia/Kolkata' },
  // Study preferences
  dailyStudyGoal: { type: Number, default: 360, min: 30, max: 1440 }, // in minutes
  preferredStudyStartTime: { type: String, default: '08:00' },
  preferredStudyEndTime: { type: String, default: '22:00' },
  themePreference: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  notificationPreferences: { type: notificationPreferencesSchema, default: () => ({}) },
  // Gamification
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastStudyDate: { type: String, default: null },
  totalStudyMinutes: { type: Number, default: 0 },
  // Auth
  googleId: { type: String, default: null, sparse: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationTokenExpire: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpire: { type: Date, default: null },
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
userSchema.methods.matchPassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password)
}

// Serialize for API (remove sensitive fields)
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.resetPasswordToken
  delete obj.resetPasswordExpire
  delete obj.verificationToken
  delete obj.verificationTokenExpire
  delete obj.__v
  return obj
}

userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ createdAt: -1 })

const User = mongoose.model('User', userSchema)
export default User
