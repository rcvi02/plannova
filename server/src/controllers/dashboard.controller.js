import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { format, startOfWeek, subDays } from 'date-fns'
import Task from '../models/Task.js'
import StudySession from '../models/StudySession.js'
import Exam from '../models/Exam.js'
import Revision from '../models/Revision.js'
import Subject from '../models/Subject.js'
import Habit from '../models/Habit.js'
import Goal from '../models/Goal.js'

// GET /api/dashboard
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const today = format(new Date(), 'yyyy-MM-dd')
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const days7Ago = format(subDays(new Date(), 6), 'yyyy-MM-dd')

  const [
    todayTasks,
    allPendingTasks,
    todaySessions,
    weeklySessions,
    upcomingExams,
    dueRevisions,
    subjects,
    habits,
    activeGoals,
    user,
  ] = await Promise.all([
    Task.find({ user: userId, dueDate: today }).populate('subject', 'name color icon'),
    Task.countDocuments({ user: userId, status: 'pending' }),
    StudySession.find({ user: userId, date: today }),
    StudySession.find({ user: userId, date: { $gte: days7Ago } }).sort('date'),
    Exam.find({ user: userId, date: { $gte: today }, status: 'upcoming' }).sort('date').limit(3).populate('subject', 'name color icon'),
    Revision.find({ user: userId, status: { $in: ['due', 'overdue'] } }),
    Subject.find({ user: userId, archived: false }).sort('order'),
    Habit.find({ user: userId, active: true }),
    Goal.find({ user: userId, status: 'active' }).limit(3),
    import('../models/User.js').then(m => m.default.findById(userId)),
  ])

  const todayMinutes = todaySessions.reduce((a, s) => a + s.duration, 0)
  const dailyGoal = user?.dailyStudyGoal || 360
  const goalPercent = Math.min(Math.round((todayMinutes / dailyGoal) * 100), 100)

  const completedToday = todayTasks.filter(t => t.status === 'completed').length
  const missedToday = todayTasks.filter(t => t.status === 'missed').length

  // Build 7-day chart
  const weeklyChart = []
  for (let i = 6; i >= 0; i--) {
    const day = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const dayLabel = format(subDays(new Date(), i), 'EEE')
    const dayMinutes = weeklySessions.filter(s => s.date === day).reduce((a, s) => a + s.duration, 0)
    weeklyChart.push({ day: dayLabel, date: day, hours: parseFloat((dayMinutes / 60).toFixed(1)), minutes: dayMinutes })
  }

  const nextExam = upcomingExams[0] || null

  return sendSuccess(res, {
    message: 'Dashboard data retrieved.',
    data: {
      todayMinutes,
      dailyGoal,
      goalPercent,
      streak: user?.streak || 0,
      todayTaskCount: todayTasks.length,
      completedToday,
      missedToday,
      pendingCount: allPendingTasks,
      dueRevisions: dueRevisions.length,
      nextExam,
      upcomingExams,
      subjects: subjects.slice(0, 6),
      habits: habits.slice(0, 6),
      activeGoals,
      weeklyChart,
      recentSessions: weeklySessions.slice(-5).reverse(),
    },
  })
})
