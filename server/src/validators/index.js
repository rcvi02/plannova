import { z } from 'zod'

export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required').max(80),
  code: z.string().max(20).optional().default(''),
  description: z.string().max(500).optional().default(''),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color hex').optional().default('#7C3AED'),
  colorSoft: z.string().optional().default('#EDE9FE'),
  icon: z.string().max(10).optional().default('📚'),
  priority: z.enum(['high', 'medium', 'low']).optional().default('medium'),
  targetHours: z.number().min(0).optional().default(0),
  totalChapters: z.number().min(0).optional().default(0),
  completedChapters: z.number().min(0).optional().default(0),
})

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200),
  description: z.string().max(1000).optional().default(''),
  subject: z.string().optional().nullable().default(null),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable().default(null),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable().default(null),
  estimatedTime: z.number().min(1).optional().default(30),
  priority: z.enum(['high', 'medium', 'low']).optional().default('medium'),
  status: z.enum(['pending', 'in-progress', 'completed', 'missed']).optional().default('pending'),
  taskType: z.enum(['study', 'revision', 'practice', 'mock-test', 'assignment', 'notes', 'video-lecture', 'pyq', 'other']).optional().default('study'),
  repeatType: z.enum(['none', 'daily', 'weekly', 'monthly']).optional().default('none'),
  repeatDays: z.array(z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])).optional().default([]),
  reminderMinutes: z.number().min(0).optional().default(0),
  tags: z.array(z.string().max(30)).optional().default([]),
})

export const examSchema = z.object({
  name: z.string().min(1, 'Exam name is required').max(150),
  subject: z.string().optional().nullable().default(null),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  examTime: z.string().optional().nullable().default(null),
  location: z.string().max(150).optional().default(''),
  totalMarks: z.number().min(0).optional().default(100),
  targetMarks: z.number().min(0).optional().default(80),
  syllabusTopics: z.array(z.object({
    title: z.string().min(1),
    completed: z.boolean().optional().default(false),
  })).optional().default([]),
  preparationProgress: z.number().min(0).max(100).optional().default(0),
  notes: z.string().max(1000).optional().default(''),
  priority: z.enum(['high', 'medium', 'low']).optional().default('high'),
})

export const sessionSchema = z.object({
  subject: z.string().optional().nullable().default(null),
  sessionType: z.enum(['pomodoro', 'manual', 'stopwatch']).optional().default('manual'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  duration: z.number().min(1, 'Duration is required'),
  breakMinutes: z.number().min(0).optional().default(0),
  focusRating: z.number().min(1).max(5).optional().default(3),
  productivityRating: z.number().min(1).max(5).optional().default(3),
  topic: z.string().max(200).optional().default(''),
  notes: z.string().max(500).optional().default(''),
  startTime: z.string().optional().nullable().default(null),
  endTime: z.string().optional().nullable().default(null),
})

export const noteSchema = z.object({
  title: z.string().min(1, 'Note title is required').max(200),
  content: z.string().optional().default(''),
  plainTextContent: z.string().optional().default(''),
  subject: z.string().optional().nullable().default(null),
  tags: z.array(z.string().max(30)).optional().default([]),
  isPinned: z.boolean().optional().default(false),
  isFavorite: z.boolean().optional().default(false),
})

export const revisionSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(200),
  subject: z.string().optional().nullable().default(null),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  confidenceBefore: z.number().min(1).max(5).optional().default(3),
  notes: z.string().max(500).optional().default(''),
})

export const goalSchema = z.object({
  title: z.string().min(1, 'Goal title is required').max(150),
  description: z.string().max(500).optional().default(''),
  goalType: z.enum(['daily', 'weekly', 'monthly', 'subject', 'exam', 'custom']).optional().default('custom'),
  subject: z.string().optional().nullable().default(null),
  targetValue: z.number().min(1, 'Target value is required'),
  current: z.number().min(0).optional().default(0),
  unit: z.string().max(30).optional().default('tasks'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  priority: z.enum(['high', 'medium', 'low']).optional().default('medium'),
  milestones: z.array(z.object({ title: z.string().min(1), completed: z.boolean().optional().default(false) })).optional().default([]),
})

export const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(100),
  description: z.string().max(300).optional().default(''),
  icon: z.string().max(10).optional().default('⭐'),
  color: z.string().optional().default('#7C3AED'),
  frequency: z.enum(['daily', 'weekly', 'custom']).optional().default('daily'),
  targetDays: z.array(z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])).optional().default([]),
  targetValue: z.number().min(1).optional().default(1),
  unit: z.string().max(20).optional().default('times'),
})
