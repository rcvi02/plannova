import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO, isPast } from 'date-fns'
import { Target, Plus, CheckCircle2, Circle, Trash2, Edit2 } from 'lucide-react'
import { addGoal, updateGoal, deleteGoal, updateGoalProgress, toggleMilestone } from '@/features/goalsSlice'
import ProgressRing from '@/components/ui/ProgressRing'
import { ProgressBar } from '@/components/ui/ProgressRing'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { format as fmt } from 'date-fns'

const GOAL_TYPES = ['daily', 'weekly', 'monthly', 'exam', 'subject']
const TYPE_CONFIG = {
  daily: { color: '#7C3AED', soft: '#EDE9FE', label: 'Daily' },
  weekly: { color: '#0EA5E9', soft: '#E0F2FE', label: 'Weekly' },
  monthly: { color: '#10B981', soft: '#D1FAE5', label: 'Monthly' },
  exam: { color: '#F43F5E', soft: '#FFE4E6', label: 'Exam' },
  subject: { color: '#F59E0B', soft: '#FEF3C7', label: 'Subject' },
}

export default function GoalsPage() {
  const dispatch = useDispatch()
  const goals = useSelector(s => s.goals.items)
  const subjects = useSelector(s => s.subjects.items)
  const [showModal, setShowModal] = useState(false)
  const [activeType, setActiveType] = useState('all')
  const [form, setForm] = useState({ title: '', type: 'weekly', target: 100, current: 0, unit: '%', deadline: fmt(new Date(), 'yyyy-MM-dd'), priority: 'high' })

  const filtered = activeType === 'all' ? goals : goals.filter(g => g.type === activeType)
  const active = filtered.filter(g => g.status === 'active')
  const completed = filtered.filter(g => g.status === 'completed')

  const handleSave = () => {
    if (!form.title.trim()) return toast.error('Goal title is required')
    dispatch(addGoal(form))
    toast.success('Goal added!')
    setShowModal(false)
    setForm({ title: '', type: 'weekly', target: 100, current: 0, unit: '%', deadline: fmt(new Date(), 'yyyy-MM-dd'), priority: 'high' })
  }

  const handleProgressUpdate = (id, current, target) => {
    dispatch(updateGoalProgress({ id, current: Math.min(current, target) }))
    if (current >= target) {
      toast.success('Goal completed!')
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } })
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Goals</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{active.length} active · {completed.length} completed</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={Plus}>Add Goal</Button>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['all', ...GOAL_TYPES].map(type => {
          const cfg = TYPE_CONFIG[type]
          return (
            <button key={type} onClick={() => setActiveType(type)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors"
              style={{ background: activeType === type ? (cfg?.soft || 'var(--accent-soft)') : 'var(--bg-surface)', color: activeType === type ? (cfg?.color || 'var(--accent)') : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              {cfg?.label || 'All'}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Target} title="No goals yet" description="Set your first goal to start tracking your academic ambitions." action={<Button onClick={() => setShowModal(true)} icon={Plus}>Add Goal</Button>} />
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Active Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {active.map((goal, i) => (
                  <GoalCard key={goal.id} goal={goal} index={i} dispatch={dispatch} onProgressUpdate={handleProgressUpdate} />
                ))}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completed.map((goal, i) => (
                  <GoalCard key={goal.id} goal={goal} index={i} dispatch={dispatch} onProgressUpdate={handleProgressUpdate} isCompleted />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Goal">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Goal title..."
              className="w-full px-3 py-2.5 text-sm rounded-xl input-focus" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
                {GOAL_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Target</label>
              <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Unit</label>
              <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="hours, %, tasks..." className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Deadline</label>
            <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>Add Goal</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function GoalCard({ goal, index, dispatch, onProgressUpdate, isCompleted }) {
  const cfg = TYPE_CONFIG[goal.type] || TYPE_CONFIG.daily
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
  const isExpired = goal.deadline && isPast(parseISO(goal.deadline)) && !isCompleted

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="rounded-2xl p-5" style={{ background: 'var(--bg-surface)', border: `1px solid ${isCompleted ? 'var(--success)' : 'var(--border)'}`, opacity: isCompleted ? 0.75 : 1 }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: cfg.soft, color: cfg.color }}>{goal.type}</span>
          <h3 className="text-sm font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
          {goal.deadline && <p className="text-xs mt-1" style={{ color: isExpired ? 'var(--danger)' : 'var(--text-muted)' }}>
            {isExpired ? 'Overdue · ' : ''}Due {format(parseISO(goal.deadline), 'MMM d')}
          </p>}
        </div>
        <div className="flex items-center gap-1">
          {isCompleted && <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />}
          <button onClick={() => { dispatch(deleteGoal(goal.id)); toast.success('Goal removed') }} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <ProgressRing percent={pct} size={56} strokeWidth={5} color={isCompleted ? 'var(--success)' : cfg.color}>
          <span className="text-xs font-bold" style={{ color: isCompleted ? 'var(--success)' : cfg.color }}>{pct}%</span>
        </ProgressRing>
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-secondary)' }}>{goal.current} / {goal.target} {goal.unit}</span>
          </div>
          <ProgressBar percent={pct} color={isCompleted ? 'var(--success)' : cfg.color} height={5} />
        </div>
      </div>

      {!isCompleted && (
        <div className="flex items-center gap-2">
          <input type="range" min={0} max={goal.target} value={goal.current}
            onChange={e => onProgressUpdate(goal.id, parseFloat(e.target.value), goal.target)}
            className="flex-1" style={{ accentColor: cfg.color }} />
          <span className="text-xs font-medium w-10 text-right" style={{ color: cfg.color }}>{goal.current}</span>
        </div>
      )}
    </motion.div>
  )
}
