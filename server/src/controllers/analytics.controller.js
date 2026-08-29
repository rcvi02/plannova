import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { format, subDays, startOfMonth, eachDayOfInterval, parseISO } from 'date-fns'
import StudySession from '../models/StudySession.js'
import Task from '../models/Task.js'
import Habit from '../models/Habit.js'
import Subject from '../models/Subject.js'

// GET /api/analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const today = format(new Date(), 'yyyy-MM-dd')
  const days7Ago = format(subDays(new Date(), 6), 'yyyy-MM-dd')
  const days30Ago = format(subDays(new Date(), 29), 'yyyy-MM-dd')
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')

  const [sessions30, tasks30, habits, subjects] = await Promise.all([
    StudySession.find({ user: userId, date: { $gte: days30Ago } }).populate('subject', 'name color'),
    Task.find({ user: userId, createdAt: { $gte: new Date(days30Ago) } }),
    Habit.find({ user: userId, active: true }),
    Subject.find({ user: userId, archived: false }),
  ])

  // Last 7 days study
  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const day = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const label = format(subDays(new Date(), i), 'EEE')
    const minutes = sessions30.filter(s => s.date === day).reduce((a, s) => a + s.duration, 0)
    last7.push({ day: label, date: day, minutes, hours: parseFloat((minutes / 60).toFixed(1)) })
  }

  // Last 30 days study (by week)
  const last30 = []
  for (let i = 29; i >= 0; i--) {
    const day = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const label = format(subDays(new Date(), i), 'MMM d')
    const minutes = sessions30.filter(s => s.date === day).reduce((a, s) => a + s.duration, 0)
    last30.push({ day: label, date: day, minutes })
  }

  // Study by subject
  const subjectMap = {}
  sessions30.forEach(s => {
    const subId = s.subject?._id?.toString() || 'other'
    const subName = s.subject?.name || 'Other'
    const subColor = s.subject?.color || '#888'
    if (!subjectMap[subId]) subjectMap[subId] = { name: subName, color: subColor, minutes: 0 }
    subjectMap[subId].minutes += s.duration
  })
  const studyBySubject = Object.values(subjectMap).sort((a, b) => b.minutes - a.minutes)

  // Task completion
  const completedTasks = tasks30.filter(t => t.status === 'completed').length
  const missedTasks = tasks30.filter(t => t.status === 'missed').length
  const pendingTasks = tasks30.filter(t => t.status === 'pending').length

  // Productivity by weekday
  const weekdayMap = { 0: { name: 'Sun', minutes: 0, count: 0 }, 1: { name: 'Mon', minutes: 0, count: 0 }, 2: { name: 'Tue', minutes: 0, count: 0 }, 3: { name: 'Wed', minutes: 0, count: 0 }, 4: { name: 'Thu', minutes: 0, count: 0 }, 5: { name: 'Fri', minutes: 0, count: 0 }, 6: { name: 'Sat', minutes: 0, count: 0 } }
  sessions30.forEach(s => {
    const d = parseISO(s.date).getDay()
    weekdayMap[d].minutes += s.duration
    weekdayMap[d].count += 1
  })
  const productivityByWeekday = Object.values(weekdayMap).map(d => ({
    ...d,
    avgMinutes: d.count > 0 ? Math.round(d.minutes / d.count) : 0,
  }))

  // Best study hour (from start times)
  const hourCount = {}
  sessions30.filter(s => s.startTime).forEach(s => {
    const hour = s.startTime.split(':')[0]
    hourCount[hour] = (hourCount[hour] || 0) + s.duration
  })
  const bestHour = Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0]

  // Average focus rating
  const avgFocus = sessions30.length
    ? (sessions30.reduce((a, s) => a + s.focusRating, 0) / sessions30.length).toFixed(1)
    : 0

  // Habit completion (last 7 days)
  const habitCompletion = habits.map(h => {
    const last7Dates = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd'))
    const completedDays = last7Dates.filter(d => h.completionHistory.some(e => e.date === d)).length
    return { name: h.name, streak: h.currentStreak, completionRate: Math.round((completedDays / 7) * 100) }
  })

  return sendSuccess(res, {
    message: 'Analytics retrieved.',
    data: {
      last7Days: last7,
      last30Days: last30,
      studyBySubject,
      taskCompletion: { completed: completedTasks, missed: missedTasks, pending: pendingTasks, total: tasks30.length },
      productivityByWeekday,
      avgFocus: parseFloat(avgFocus),
      totalHours30: parseFloat((sessions30.reduce((a, s) => a + s.duration, 0) / 60).toFixed(1)),
      bestStudyHour: bestHour ? `${bestHour[0]}:00` : null,
      habitCompletion,
      subjectProgress: subjects.map(s => ({ name: s.name, color: s.color, progress: s.progress, studyHours: s.studyHours })),
    },
  })
})
