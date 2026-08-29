import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  course: z.string().max(100).optional().default(''),
  college: z.string().max(150).optional().default(''),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  course: z.string().max(100).optional(),
  college: z.string().max(150).optional(),
  semester: z.string().max(30).optional(),
  timezone: z.string().max(50).optional(),
  dailyStudyGoal: z.number().min(30).max(1440).optional(),
  preferredStudyStartTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  preferredStudyEndTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  themePreference: z.enum(['light', 'dark', 'system']).optional(),
  notificationPreferences: z.object({
    taskReminders: z.boolean().optional(),
    examReminders: z.boolean().optional(),
    revisionReminders: z.boolean().optional(),
    habitReminders: z.boolean().optional(),
    goalReminders: z.boolean().optional(),
    emailNotifications: z.boolean().optional(),
  }).optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
})

export const resetPasswordSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
