import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, addDays, subDays, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Clock, CheckCircle2, Circle, StickyNote, Play, ExternalLink } from 'lucide-react'
import { updateTask } from '@/features/tasksSlice'
import { ProgressBar } from '@/components/ui/ProgressRing'
import { PriorityBadge } from '@/components/ui/Badge'
import { formatMinutes, formatSeconds } from '@/utils/helpers'
import toast from 'react-hot-toast'

export default function TodayPage() {
  const dispatch = useDispatch()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const tasks    = useSelector(s => s.tasks.items)
  const subjects = useSelector(s => s.subjects.items)
  const sessions = useSelector(s => s.sessions.items)
  const timer    = useSelector(s => s.timer)

  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const todayTasks = tasks.filter(t => t.dueDate === dateStr)
  const completed = todayTasks.filter(t => t.status === 'completed')
  const pending = todayTasks.filter(t => t.status !== 'completed')
  const todayMinutes = sessions.filter(s => s.date === dateStr).reduce((a, s) => a + s.duration, 0)
  const completionPct = todayTasks.length > 0 ? Math.round((completed.length / todayTasks.length) * 100) : 0

  const getSubject = (id) => subjects.find(s => s.id === id)

  const handleToggle = (id) => {
    dispatch(updateTask({ id, data: { status: 'completed' } }))
    toast.success('Task updated!')
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedDate(d => subDays(d, 1))} className="btn btn-ghost p-2">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setSelectedDate(new Date())} className="btn btn-secondary text-sm px-3 py-1.5">Today</button>
          <button onClick={() => setSelectedDate(d => addDays(d, 1))} className="btn btn-ghost p-2">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Tasks Total', value: todayTasks.length, color: 'var(--accent)' },
          { label: 'Completed', value: completed.length, color: 'var(--success)' },
          { label: 'Remaining', value: pending.length, color: 'var(--warning)' },
          { label: 'Study Time', value: formatMinutes(todayMinutes), color: 'var(--accent-2)' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-2xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Daily Progress</p>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{completionPct}%</span>
        </div>
        <ProgressBar percent={completionPct} color="var(--success)" height={8} />
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{completed.length} of {todayTasks.length} tasks completed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pending */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Pending ({pending.length})</h3>
              <button className="btn btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-2.5">
                <Plus size={13} />Add Task
              </button>
            </div>
            <div className="p-2 space-y-1">
              {pending.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>All done! 🎉</p>
              ) : (
                pending.map(task => {
                  const subject = getSubject(task.subjectId)
                  return (
                    <motion.div key={task.id} layout
                      className="flex items-center gap-3 p-3.5 rounded-xl transition-colors hover:bg-[var(--bg-hover)] group cursor-pointer"
                      onClick={() => handleToggle(task.id)}>
                      <Circle size={18} style={{ color: subject?.color || 'var(--border)', flexShrink: 0 }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {subject && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{subject.name}</span>}
                          {task.estimatedTime && <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}><Clock size={10} />{formatMinutes(task.estimatedTime)}</span>}
                        </div>
                      </div>
                      <PriorityBadge priority={task.priority} />
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>

          {/* Completed */}
          {completed.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Completed ({completed.length})</h3>
              </div>
              <div className="p-2 space-y-1">
                {completed.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-[var(--bg-hover)] cursor-pointer" onClick={() => handleToggle(task.id)}>
                    <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <p className="text-sm flex-1 line-through" style={{ color: 'var(--text-muted)' }}>{task.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Focus Timer Widget — live link */}
          <Link to="/app/timer">
            <div className="rounded-2xl p-5 hover:opacity-95 transition-opacity cursor-pointer"
              style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Focus Timer</p>
                <ExternalLink size={13} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                {timer.isRunning ? '🔴 Session in progress' : 'Start a Pomodoro session'}
              </p>
              <div className="text-3xl font-mono font-bold text-center mb-4" style={{ color: 'var(--accent)' }}>
                {formatSeconds(timer.timeLeft)}
              </div>
              <div className="btn btn-primary w-full justify-center text-sm flex items-center gap-2">
                <Play size={12} fill="white" />
                {timer.isRunning ? 'View Timer' : 'Start Session'}
              </div>
            </div>
          </Link>

          {/* Daily Notes */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <StickyNote size={15} style={{ color: 'var(--accent)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Daily Notes</p>
            </div>
            <textarea
              placeholder="Write your thoughts for today..."
              rows={5}
              className="w-full text-sm resize-none outline-none p-2 rounded-xl"
              style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
