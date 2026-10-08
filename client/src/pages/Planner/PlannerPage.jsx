import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, isToday, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react'
import { getPriorityConfig } from '@/utils/helpers'

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6) // 6 AM - 9 PM

export default function PlannerPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [view, setView] = useState('week')
  const tasks = useSelector(s => s.tasks.items)
  const subjects = useSelector(s => s.subjects.items)

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getTasksForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return tasks.filter(t => t.dueDate === dateStr)
  }

  const getSubject = (id) => subjects.find(s => s.id === id)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Weekly Planner</h1>
          <div className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-xl" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            {format(weekStart, 'MMM d')} — {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            {['week', 'list'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-1.5 text-xs font-medium capitalize transition-colors"
                style={{ background: view === v ? 'var(--accent)' : 'var(--bg-surface)', color: view === v ? 'var(--text-inverse)' : 'var(--text-secondary)' }}>
                {v}
              </button>
            ))}
          </div>
          <button onClick={() => setCurrentWeek(w => subWeeks(w, 1))} className="btn btn-ghost p-2"><ChevronLeft size={16} /></button>
          <button onClick={() => setCurrentWeek(new Date())} className="btn btn-secondary text-xs px-3 py-1.5">This Week</button>
          <button onClick={() => setCurrentWeek(w => addWeeks(w, 1))} className="btn btn-ghost p-2"><ChevronRight size={16} /></button>
        </div>
      </div>

      {view === 'week' ? (
        <div className="flex-1 overflow-auto">
          {/* Day Headers */}
          <div className="grid grid-cols-8 sticky top-0 z-10" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
            <div className="p-3" />
            {weekDays.map(day => (
              <div key={day.toString()} className={`p-3 text-center border-l`} style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{format(day, 'EEE')}</p>
                <div className={`w-8 h-8 flex items-center justify-center mx-auto rounded-full mt-1 text-sm font-bold ${isToday(day) ? 'text-white' : ''}`}
                  style={{ background: isToday(day) ? 'var(--accent)' : 'transparent', color: isToday(day) ? 'var(--text-inverse)' : 'var(--text-primary)' }}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-8">
            <div className="border-r" style={{ borderColor: 'var(--border)' }}>
              {HOURS.map(h => (
                <div key={h} className="h-20 flex items-start justify-end pr-3 pt-1">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{h}:00</span>
                </div>
              ))}
            </div>
            {weekDays.map(day => {
              const dayTasks = getTasksForDate(day)
              return (
                <div key={day.toString()} className="border-l relative" style={{ borderColor: 'var(--border)' }}>
                  {HOURS.map(h => (
                    <div key={h} className="h-20 border-b" style={{ borderColor: 'var(--border-subtle)' }} />
                  ))}
                  <div className="absolute top-2 left-1 right-1 space-y-1">
                    {dayTasks.slice(0, 4).map(task => {
                      const subject = getSubject(task.subjectId)
                      const p = getPriorityConfig(task.priority)
                      return (
                        <div key={task.id} className="px-2 py-1.5 rounded-lg text-xs font-medium truncate cursor-pointer"
                          style={{ background: subject?.color ? subject.color + '20' : 'var(--accent-soft)', color: subject?.color || 'var(--accent)', border: `1px solid ${subject?.color ? subject.color + '40' : 'var(--border)'}` }}>
                          {task.title}
                        </div>
                      )
                    })}
                    {dayTasks.length > 4 && (
                      <div className="px-2 py-1 text-xs" style={{ color: 'var(--text-muted)' }}>+{dayTasks.length - 4} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6 max-w-3xl">
            {weekDays.map(day => {
              const dayTasks = getTasksForDate(day)
              return (
                <div key={day.toString()}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${isToday(day) ? 'text-white' : ''}`}
                      style={{ background: isToday(day) ? 'var(--accent)' : 'var(--bg-surface-2)', color: isToday(day) ? 'var(--text-inverse)' : 'var(--text-secondary)' }}>
                      {format(day, 'd')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{format(day, 'EEEE')}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{dayTasks.length} tasks</p>
                    </div>
                  </div>
                  {dayTasks.length === 0 ? (
                    <p className="text-sm pl-12" style={{ color: 'var(--text-muted)' }}>No tasks · Clear day!</p>
                  ) : (
                    <div className="pl-12 space-y-2">
                      {dayTasks.map(task => {
                        const subject = getSubject(task.subjectId)
                        return (
                          <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: subject?.color || 'var(--border)' }} />
                            <p className="text-sm flex-1" style={{ color: 'var(--text-primary)', textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>{task.title}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{task.priority}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
