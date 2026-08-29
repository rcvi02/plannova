import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { format, subDays, parseISO } from 'date-fns'
import { Plus, Activity, Flame, Check, Trash2, Edit2 } from 'lucide-react'
import { toggleHabitToday, addHabit, deleteHabit, archiveHabit } from '@/features/habitsSlice'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import toast from 'react-hot-toast'

const HABIT_ICONS = ['🌅', '📖', '🧮', '📝', '🏃', '💧', '🧘', '🎯', '💻', '🍎', '🌙', '✍️']

// Heatmap for last 52 weeks (364 days)
function HabitHeatmap({ completedDates }) {
  const today = new Date()
  const days = Array.from({ length: 91 }, (_, i) => {
    const date = subDays(today, 90 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    return { date, dateStr, completed: completedDates?.includes(dateStr) }
  })

  return (
    <div className="flex flex-wrap gap-1">
      {days.map(d => (
        <div key={d.dateStr} title={d.dateStr} className="heatmap-cell"
          style={{ background: d.completed ? 'var(--success)' : 'var(--bg-surface-3)' }} />
      ))}
    </div>
  )
}

export default function HabitsPage() {
  const dispatch = useDispatch()
  const habits = useSelector(s => s.habits.items).filter(h => !h.archived)
  const [showModal, setShowModal] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '🌅', color: '#7C3AED', frequency: 'daily' })

  const today = format(new Date(), 'yyyy-MM-dd')

  const handleAdd = () => {
    if (!form.name.trim()) return toast.error('Habit name is required')
    dispatch(addHabit(form))
    toast.success('Habit added! Start your streak today 🔥')
    setShowModal(false)
    setForm({ name: '', icon: '🌅', color: '#7C3AED', frequency: 'daily' })
  }

  const handleToggle = (id) => {
    dispatch(toggleHabitToday(id))
    toast.success('Habit updated!')
  }

  const totalCompletedToday = habits.filter(h => h.completedDates?.includes(today)).length
  const totalStreak = habits.reduce((a, h) => a + (h.streak || 0), 0)
  const bestStreak = Math.max(...habits.map(h => h.longestStreak || 0), 0)

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Habits</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{habits.length} habits · {totalCompletedToday} done today</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={Plus}>Add Habit</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Today's Progress", value: `${totalCompletedToday}/${habits.length}`, color: 'var(--success)' },
          { label: 'Total Active Streak', value: `${totalStreak}d`, color: '#F59E0B' },
          { label: 'Best Streak', value: `${bestStreak}d`, color: 'var(--accent)' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {habits.length === 0 ? (
        <EmptyState icon={Activity} title="No habits yet" description="Build unstoppable study habits, one day at a time." action={<Button onClick={() => setShowModal(true)} icon={Plus}>Add Habit</Button>} />
      ) : (
        <div className="space-y-3">
          {habits.map((habit, i) => {
            const doneToday = habit.completedDates?.includes(today)
            const completionPct = habit.completedDates?.length > 0 ? Math.min(Math.round((habit.completedDates.length / 30) * 100), 100) : 0
            const isExpanded = expandedId === habit.id

            return (
              <motion.div key={habit.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: `2px solid ${doneToday ? habit.color + '40' : 'var(--border)'}` }}>
                  <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : habit.id)}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: habit.color + '18' }}>
                      {habit.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{habit.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Flame size={11} style={{ color: 'var(--warning)' }} />
                          <span className="text-xs font-medium" style={{ color: 'var(--warning)' }}>{habit.streak} day streak</span>
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Best: {habit.longestStreak}d</span>
                        <span className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{habit.frequency}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggle(habit.id) }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{ background: doneToday ? habit.color : 'transparent', border: `2px solid ${doneToday ? habit.color : 'var(--border)'}` }}
                        aria-label={doneToday ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {doneToday && <Check size={14} className="text-white" />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); dispatch(deleteHabit(habit.id)); toast.success('Habit removed') }}
                        className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Heatmap */}
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-4 pb-4" style={{ borderTop: '1px solid var(--border)' }}>
                      <p className="text-xs font-semibold mb-3 mt-3" style={{ color: 'var(--text-muted)' }}>LAST 91 DAYS</p>
                      <HabitHeatmap completedDates={habit.completedDates} />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Habit">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Habit Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Morning study session"
              className="w-full px-3 py-2.5 text-sm rounded-xl input-focus" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {HABIT_ICONS.map(icon => (
                <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))} className="w-9 h-9 rounded-lg text-xl flex items-center justify-center"
                  style={{ background: form.icon === icon ? 'var(--accent-soft)' : 'var(--bg-surface-2)', border: form.icon === icon ? '2px solid var(--accent)' : '1px solid var(--border)' }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Frequency</label>
            <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAdd}>Add Habit</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
