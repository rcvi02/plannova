import { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, subDays, parseISO } from 'date-fns'
import {
  Clock, CheckCircle2, Flame, Target, AlertCircle, GraduationCap,
  Plus, Play, TrendingUp, BookOpen, BarChart3, Zap, ChevronRight,
  Calendar, Activity, ArrowRight, Star, Brain, Hand, Sun, Sparkles, Circle
} from 'lucide-react'
import { updateTask } from '@/features/tasksSlice'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import IconRenderer from '@/components/ui/IconRenderer'
import StatCard from '@/components/ui/StatCard'
import { ChartCard } from '@/components/ui/StatCard'
import ProgressRing from '@/components/ui/ProgressRing'
import { ProgressBar } from '@/components/ui/ProgressRing'
import Badge, { PriorityBadge, StatusBadge } from '@/components/ui/Badge'
import Tooltip from '@/components/ui/Tooltip'
import { formatMinutes, getGreeting, getMotivationalQuote, getDaysUntilExam, getProgressColor } from '@/utils/helpers'

const stagger  = { animate: { transition: { staggerChildren: 0.05 } } }
const fadeUp   = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.2 } } }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-xl text-xs shadow-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}h</p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const dispatch  = useDispatch()
  const user      = useSelector(s => s.auth.user)
  const tasks     = useSelector(s => s.tasks.items)
  const subjects  = useSelector(s => s.subjects.items)
  const exams     = useSelector(s => s.exams.items)
  const sessions  = useSelector(s => s.sessions.items)
  const habits    = useSelector(s => s.habits.items)
  const goals     = useSelector(s => s.goals.items)
  const revisions = useSelector(s => s.revisions.items)
  
  const today = format(new Date(), 'yyyy-MM-dd')

  const stats = useMemo(() => {
    const todayTasks    = tasks.filter(t => t.dueDate === today)
    const completedToday= tasks.filter(t => t.status === 'completed' && t.completedAt?.startsWith(today))
    const pendingTasks  = tasks.filter(t => t.status === 'pending')
    const todayMinutes  = sessions.filter(s => s.date === today).reduce((a, s) => a + (s.duration || 0), 0)
    const goalMinutes   = user?.dailyStudyGoal || user?.dailyGoalMinutes || 360
    const goalPercent   = goalMinutes > 0 ? Math.min(Math.round((todayMinutes / goalMinutes) * 100), 100) : 0
    const nextExam      = exams.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0]
    const dueRevisions  = revisions.filter(r => r.status === 'due' || r.status === 'overdue')
    return {
      todayMinutes, goalPercent, goalMinutes,
      completedToday:  completedToday.length,
      pendingCount:    pendingTasks.length,
      todayTaskCount:  todayTasks.length,
      streak:          user?.streak || 0,
      nextExam,
      dueRevisions:    dueRevisions.length,
    }
  }, [tasks, sessions, exams, revisions, user])

  const weeklyData = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const date      = subDays(new Date(), 6 - i)
      const dateStr   = format(date, 'yyyy-MM-dd')
      const dayMinutes= sessions.filter(s => s.date === dateStr).reduce((a, s) => a + (s.duration || 0), 0)
      return { day: format(date, 'EEE'), date: dateStr, hours: parseFloat((dayMinutes / 60).toFixed(1)) }
    })
  , [sessions])

  const subjectDist = useMemo(() =>
    subjects.filter(s => (s.studyHours || 0) > 0).slice(0, 5).map(s => ({ name: s.name, value: s.studyHours || 0, color: s.color }))
  , [subjects])

  const upcomingExams  = exams.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
  const recentSessions = sessions.slice(0, 5)
  const activeGoals    = goals.filter(g => g.status === 'active').slice(0, 3)
  const todayHabits    = habits.filter(h => !h.archived).slice(0, 5)
  const priorityTasks  = tasks.filter(t => t.status !== 'completed' && t.dueDate === today).slice(0, 5)
  const isNewUser      = subjects.length === 0 && sessions.length === 0 && tasks.length === 0

  const getSubject = (id) => subjects.find(s => s.id === id || s._id === id)

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* ─── Header ─── */}
      <motion.div variants={stagger} initial="initial" animate="animate"
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <motion.div variants={fadeUp}>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'} <Sun size={20} className="inline ml-1" style={{ color: '#F59E0B' }} />
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {format(new Date(), 'EEEE, MMMM d')} · {getMotivationalQuote()}
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex items-center gap-2 flex-shrink-0">
          <Link to="/app/tasks" className="btn btn-secondary text-xs sm:text-sm flex items-center gap-1.5 py-2 px-3 sm:px-4">
            <Plus size={13} /> Quick Add
          </Link>
          <Link to="/app/timer" className="btn btn-primary text-xs sm:text-sm flex items-center gap-1.5 py-2 px-3 sm:px-4">
            <Play size={12} fill="currentColor" /> Start Focus
          </Link>
        </motion.div>
      </motion.div>

      {/* ─── Onboarding ─── */}
      {isNewUser && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-5 sm:p-6"
          style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="text-4xl"><GraduationCap size={40} /></div>
            <div className="flex-1">
              <h2 className="text-base font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                Welcome to Plannova!
                <Sparkles size={16} style={{ color: '#F59E0B' }} />
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Get started by adding your first subject, then plan tasks and track your focus sessions.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Add Subject', to: '/app/subjects', icon: BookOpen },
                { label: 'Add Task',    to: '/app/tasks',    icon: Plus },
                { label: 'Start Timer', to: '/app/timer',    icon: Play },
              ].map(({ label, to, icon: Icon }) => (
                <Link key={label} to={to} className="btn btn-primary text-xs flex items-center gap-1.5">
                  <Icon size={12} />{label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Stats Row ─── */}
      <motion.div variants={stagger} initial="initial" animate="animate"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: "Today's Study", value: formatMinutes(stats.todayMinutes), icon: Clock,         iconColor: '#7C3AED', subtext: `Goal: ${formatMinutes(stats.goalMinutes)}`, delay: 0, tooltip: 'Total focus time recorded today' },
          { label: 'Goal Progress', value: `${stats.goalPercent}%`,           icon: Target,        iconColor: '#0EA5E9', subtext: `${formatMinutes(stats.goalMinutes)} daily`, delay: 0.05, tooltip: 'Progress toward your daily study goal' },
          { label: 'Streak',        value: `${stats.streak}d`,               icon: Flame,         iconColor: '#D97706', subtext: 'Keep it up!',  delay: 0.1, tooltip: 'Consecutive days you have studied' },
          { label: 'Completed',     value: stats.completedToday,             icon: CheckCircle2,  iconColor: '#059669', subtext: 'Tasks today',   delay: 0.15, tooltip: 'Number of tasks you finished today' },
          { label: 'Pending',       value: stats.pendingCount,               icon: AlertCircle,   iconColor: '#DC2626', subtext: 'Tasks left',    delay: 0.2, tooltip: 'Tasks that are still pending' },
          { label: 'Next Exam',     value: stats.nextExam ? `${getDaysUntilExam(stats.nextExam.date)}d` : '—', icon: GraduationCap, iconColor: '#8B5CF6', subtext: stats.nextExam?.name || 'No exams', delay: 0.25, tooltip: 'Days remaining until your next exam' },
        ].map(stat => (
          <motion.div key={stat.label} variants={fadeUp} className="h-full">
            <Tooltip content={stat.tooltip} position="bottom">
              <StatCard {...stat} className="h-full w-full" />
            </Tooltip>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Weekly Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="xl:col-span-2">
          <ChartCard title="Weekly Study Hours" subtitle="Hours studied each day this week" action={
            <Link to="/app/analytics" className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--accent)' }}>
              View All <ChevronRight size={12} />
            </Link>
          }>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="hours" name="Hours" stroke="#7C3AED" strokeWidth={2.5} fill="url(#studyGrad)"
                  dot={{ fill: '#7C3AED', r: 3 }} activeDot={{ r: 5, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* Subject Distribution */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <ChartCard title="Subject Distribution" subtitle="Study hours by subject">
            {subjectDist.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie data={subjectDist} cx="50%" cy="50%" innerRadius={28} outerRadius={46} paddingAngle={3} dataKey="value">
                      {subjectDist.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  {subjectDist.map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      <span className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
                      <span className="text-xs ml-auto font-semibold" style={{ color: 'var(--text-primary)' }}>{s.value}h</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center">
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>No study data yet.<br />Start a session!</p>
              </div>
            )}
          </ChartCard>
        </motion.div>
      </div>

      {/* ─── Row 2: Tasks / Exams / Goals ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Today's Tasks */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="rounded-2xl overflow-hidden h-full glass-surface stat-glow">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <Tooltip content="Tasks you have scheduled for today" position="top">
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Today's Tasks</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stats.completedToday}/{stats.todayTaskCount} completed</p>
                </div>
              </Tooltip>
              <Link to="/app/tasks" className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}>View All</Link>
            </div>
            <div className="p-2 space-y-0.5">
              {priorityTasks.length === 0 ? (
                <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>No tasks due today</p>
              ) : (
                priorityTasks.map(task => {
                  const subject = getSubject(task.subjectId)
                  return (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-surface-2)] transition-colors group border border-transparent hover:border-[var(--border)]">
                      <button 
                        onClick={() => dispatch(updateTask({ id: task.id, data: { status: 'completed' } }))} 
                        className="flex-shrink-0 transition-transform hover:scale-110"
                      >
                        <Circle size={18} style={{ color: subject?.color || 'var(--text-muted)' }} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subject?.name || 'No subject'}</p>
                      </div>
                      <PriorityBadge priority={task.priority} />
                    </div>
                  )
                })
              )}
            </div>
            <div className="px-4 sm:px-5 py-3" style={{ borderTop: '1px solid var(--border)' }}>
              <ProgressBar
                percent={stats.todayTaskCount > 0 ? (stats.completedToday / stats.todayTaskCount) * 100 : 0}
                color="var(--success)"
              />
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                {stats.todayTaskCount > 0 ? Math.round((stats.completedToday / stats.todayTaskCount) * 100) : 0}% complete
              </p>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Exams */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="rounded-2xl overflow-hidden h-full glass-surface stat-glow">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <Tooltip content="Your upcoming scheduled exams" position="top">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Upcoming Exams</h3>
              </Tooltip>
              <Link to="/app/exams" className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}>View All</Link>
            </div>
            <div className="p-3 space-y-2">
              {upcomingExams.map(exam => {
                const subject = getSubject(exam.subjectId)
                const days    = getDaysUntilExam(exam.date)
                const isUrgent= days <= 7
                return (
                  <Link key={exam.id} to={`/app/exams/${exam.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: isUrgent ? 'var(--danger-soft)' : 'var(--accent-soft)', color: isUrgent ? 'var(--danger)' : 'var(--accent)' }}>
                        {days}d
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{exam.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subject?.name} · {format(parseISO(exam.date), 'MMM d')}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-semibold" style={{ color: getProgressColor(exam.prepProgress) }}>{exam.prepProgress}%</span>
                        <div className="w-14"><ProgressBar percent={exam.prepProgress} color={getProgressColor(exam.prepProgress)} height={4} /></div>
                      </div>
                    </div>
                  </Link>
                )
              })}
              {upcomingExams.length === 0 && (
                <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>No upcoming exams</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Active Goals */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="rounded-2xl overflow-hidden h-full glass-surface stat-glow">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <Tooltip content="Goals you are currently working towards" position="top">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Active Goals</h3>
              </Tooltip>
              <Link to="/app/goals" className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}>View All</Link>
            </div>
            <div className="p-4 space-y-4">
              {activeGoals.map(goal => {
                const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium truncate flex-1" style={{ color: 'var(--text-primary)' }}>{goal.title}</p>
                      <span className="text-xs font-bold ml-2" style={{ color: 'var(--accent)' }}>{pct}%</span>
                    </div>
                    <ProgressBar percent={pct} color="var(--accent)" height={5} />
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{goal.current} / {goal.target} {goal.unit}</p>
                  </div>
                )
              })}
              {activeGoals.length === 0 && (
                <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No active goals yet</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Row 3: Subject Progress + Habits + Revision ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Subject Progress */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="rounded-2xl overflow-hidden glass-surface stat-glow">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Subject Progress</h3>
              <Link to="/app/subjects" className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}>View All</Link>
            </div>
            <div className="p-4 space-y-4">
              {subjects.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>Add subjects to track progress</p>
              ) : (
                subjects.slice(0, 4).map(s => {
                  const pct = s.totalChapters > 0 ? Math.round((s.completedChapters / s.totalChapters) * 100) : 0
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.colorSoft || s.color + '18', color: s.color }}>
                        <IconRenderer name={s.icon} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</p>
                          <span className="text-xs font-bold" style={{ color: s.color }}>{pct}%</span>
                        </div>
                        <ProgressBar percent={pct} color={s.color} height={5} />
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.completedChapters}/{s.totalChapters} chapters · {s.studyHours}h</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </motion.div>

        {/* Right column: Habits + Revision */}
        <div className="space-y-4">
          {/* Today's Habits */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="rounded-2xl overflow-hidden glass-surface stat-glow">
              <div className="flex items-center justify-between px-4 sm:px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Today's Habits</h3>
                <Link to="/app/habits" className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}>View All</Link>
              </div>
              <div className="p-3 space-y-1">
                {todayHabits.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No habits tracked yet</p>
                ) : (
                  todayHabits.map(habit => {
                    const doneToday = habit.completedDates?.includes(today)
                    return (
                      <div key={habit.id} className="flex items-center gap-3 p-2.5 rounded-xl">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: habit.color + '18' }}>
                          <IconRenderer name={habit.icon || 'Star'} size={14} />
                        </div>
                        <p className="text-sm flex-1" style={{ color: doneToday ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: doneToday ? 'line-through' : 'none' }}>
                          {habit.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <Flame size={11} style={{ color: 'var(--warning)' }} />
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{habit.streak}</span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${doneToday ? 'bg-emerald-500' : ''}`}
                            style={{ border: doneToday ? 'none' : '2px solid var(--border)' }}>
                            {doneToday && <span className="text-white text-[10px] font-bold">✓</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </motion.div>

          {/* Revision Due */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <div className="rounded-2xl p-4 sm:p-5"
              style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                  <Brain size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Revision Due</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stats.dueRevisions} topics need review</p>
                </div>
              </div>
              <Link to="/app/revision" className="btn btn-primary text-xs w-full justify-center py-2.5">
                Start Revision <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Recent Sessions Table ─── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <div className="rounded-2xl overflow-hidden glass-surface stat-glow">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Study Sessions</h3>
            <Link to="/app/sessions" className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}>View All</Link>
          </div>
          {recentSessions.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No sessions yet. Start your first focus session!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--bg-surface-2)' }}>
                    {['Subject', 'Topic', 'Date', 'Duration', 'Rating'].map(h => (
                      <th key={h} className="text-left px-4 sm:px-5 py-2.5 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((session, i) => {
                    const subject = getSubject(session.subjectId)
                    return (
                      <tr key={session.id}
                        style={{ borderTop: i > 0 ? '1px solid var(--border-subtle)' : 'none' }}
                        className="transition-colors hover:bg-[var(--bg-hover)]">
                        <td className="px-4 sm:px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: subject?.color || '#888' }} />
                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{subject?.name || '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{session.topic || '—'}</td>
                        <td className="px-4 sm:px-5 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{format(parseISO(session.date), 'MMM d')}</td>
                        <td className="px-4 sm:px-5 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{formatMinutes(session.duration)}</td>
                        <td className="px-4 sm:px-5 py-3">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <span key={s} className="text-xs" style={{ color: s <= session.rating ? 'var(--warning)' : 'var(--border)' }}>★</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
