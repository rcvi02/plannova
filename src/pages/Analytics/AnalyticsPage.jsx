import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { format, subDays, parseISO } from 'date-fns'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import { ChartCard } from '@/components/ui/StatCard'
import StatCard from '@/components/ui/StatCard'
import { Clock, CheckCircle2, Flame, TrendingUp, BarChart3, Brain, Target, Activity } from 'lucide-react'
import { formatMinutes } from '@/utils/helpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-xl text-xs" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
      <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  )
}

export default function AnalyticsPage() {
  const sessions = useSelector(s => s.sessions.items)
  const tasks = useSelector(s => s.tasks.items)
  const subjects = useSelector(s => s.subjects.items)
  const habits = useSelector(s => s.habits.items)
  const [range, setRange] = useState(30)

  const rangeStart = format(subDays(new Date(), range), 'yyyy-MM-dd')
  const rangeSessions = sessions.filter(s => s.date >= rangeStart)

  const totalMins = rangeSessions.reduce((a, s) => a + s.duration, 0)
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const avgRating = rangeSessions.length > 0 ? (rangeSessions.reduce((a, s) => a + (s.rating || 0), 0) / rangeSessions.length).toFixed(1) : 0

  // Daily study hours for last 14 days
  const dailyData = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = subDays(new Date(), 13 - i)
      const dateStr = format(date, 'yyyy-MM-dd')
      const mins = sessions.filter(s => s.date === dateStr).reduce((a, s) => a + s.duration, 0)
      return { day: format(date, 'MMM d'), hours: parseFloat((mins / 60).toFixed(1)) }
    })
  }, [sessions])

  // Subject distribution
  const subjectData = useMemo(() =>
    subjects.map(s => ({ name: s.name, hours: s.studyHours, color: s.color })).filter(s => s.hours > 0)
  , [subjects])

  // Weekday productivity
  const weekdayData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days.map((day, i) => {
      const daySessions = sessions.filter(s => new Date(s.date).getDay() === i)
      return { day, hours: parseFloat((daySessions.reduce((a, s) => a + s.duration, 0) / 60).toFixed(1)) }
    })
  }, [sessions])

  // Task completion over time
  const taskCompletionData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
      return {
        day: format(subDays(new Date(), 6 - i), 'EEE'),
        completed: tasks.filter(t => t.completedAt?.startsWith(date)).length,
        added: tasks.filter(t => t.createdAt?.startsWith(date)).length,
      }
    })
  }, [tasks])

  // Insight cards — safe reduce with null checks
  const bestDay = weekdayData.length > 0
    ? weekdayData.reduce((a, b) => (a.hours || 0) >= (b.hours || 0) ? a : b)
    : null
  const mostStudied = subjectData.length > 0
    ? subjectData.reduce((a, b) => (a.hours || 0) >= (b.hours || 0) ? a : b)
    : null
  const habitStreaks = (habits || []).reduce((a, h) => a + (h.streak || 0), 0)

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your study performance insights</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setRange(d)} className="px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{ background: range === d ? 'var(--accent)' : 'var(--bg-surface)', color: range === d ? 'var(--text-inverse)' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Study Time', value: formatMinutes(totalMins), icon: Clock, iconColor: '#7C3AED', delay: 0 },
          { label: 'Sessions', value: rangeSessions.length, icon: BarChart3, iconColor: '#0EA5E9', delay: 0.05 },
          { label: 'Tasks Completed', value: completedTasks, icon: CheckCircle2, iconColor: '#10B981', delay: 0.1 },
          { label: 'Avg. Focus Rating', value: `${avgRating}★`, icon: TrendingUp, iconColor: '#F59E0B', delay: 0.15 },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Daily Study Hours" subtitle="Last 14 days">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="hours" name="Hours" stroke="#7C3AED" strokeWidth={2} fill="url(#aGrad)" dot={{ r: 3, fill: '#7C3AED' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Productivity by Weekday">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekdayData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" name="Hours" radius={[4,4,0,0]}>
                {weekdayData.map((entry, i) => (
                  <Cell key={i} fill={entry.hours === Math.max(...weekdayData.map(d => d.hours)) ? '#7C3AED' : '#7C3AED40'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Subject Distribution" subtitle="Hours by subject" className="lg:col-span-1">
          <div className="flex flex-col gap-3 mt-2">
            {subjectData.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                  <span style={{ color: s.color }}>{s.hours}h</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-surface-3)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min((s.hours / Math.max(...subjectData.map(d => d.hours), 1)) * 100, 100)}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Task Completion" subtitle="Last 7 days" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={taskCompletionData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[3,3,0,0]} />
              <Bar dataKey="added" name="Added" fill="#7C3AED40" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Insight Cards */}
      <div>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>Smart Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
        { icon: '📅', title: 'Best Study Day', value: bestDay?.day || '—', desc: `${bestDay?.hours || 0}h on average` },
            { icon: '📚', title: 'Most Studied', value: mostStudied?.name || '—', desc: `${mostStudied?.hours || 0}h total` },
            { icon: '🔥', title: 'Total Streak Points', value: `${habitStreaks}d`, desc: 'Combined habit streaks' },
            { icon: '✅', title: 'Completion Rate', value: `${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`, desc: `${completedTasks}/${totalTasks} tasks` },
          ].map((insight, i) => (
            <motion.div key={insight.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="text-2xl mb-2">{insight.icon}</div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{insight.title}</p>
              <p className="text-lg font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{insight.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{insight.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
