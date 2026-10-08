import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO, addDays } from 'date-fns'
import { RefreshCw, Plus, CheckCircle, Clock, AlertTriangle, Calendar, Brain } from 'lucide-react'
import { completeRevision, rescheduleRevision, addRevision, deleteRevision } from '@/features/revisionsSlice'
import Badge, { StatusBadge } from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import toast from 'react-hot-toast'
import { format as fmt } from 'date-fns'

export default function RevisionPage() {
  const dispatch = useDispatch()
  const revisions = useSelector(s => s.revisions.items)
  const subjects = useSelector(s => s.subjects.items)
  const [showModal, setShowModal] = useState(false)
  const [completeModal, setCompleteModal] = useState(null)
  const [confidence, setConfidence] = useState(3)
  const [form, setForm] = useState({ topic: '', subjectId: '', dueDate: fmt(new Date(), 'yyyy-MM-dd') })

  const getSubject = id => subjects.find(s => s.id === id)

  const due = revisions.filter(r => r.status === 'due')
  const overdue = revisions.filter(r => r.status === 'overdue')
  const upcoming = revisions.filter(r => r.status === 'upcoming')

  const handleComplete = () => {
    if (!completeModal) return
    dispatch(completeRevision({ id: completeModal.id, confidence }))
    toast.success('Revision completed! Next due date scheduled.')
    setCompleteModal(null)
  }

  const handleAdd = () => {
    if (!form.topic.trim()) return toast.error('Topic is required')
    dispatch(addRevision(form))
    toast.success('Revision topic added!')
    setShowModal(false)
    setForm({ topic: '', subjectId: '', dueDate: fmt(new Date(), 'yyyy-MM-dd') })
  }

  const Section = ({ title, icon: Icon, items, color }) => (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} style={{ color }} />
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map(rev => {
          const sub = getSubject(rev.subjectId)
          return (
            <motion.div key={rev.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: 'var(--bg-surface)', border: `1px solid var(--border)` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                <Brain size={18} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{rev.topic}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  {sub && <span className="text-xs" style={{ color: sub.color }}>● {sub.name}</span>}
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Revision #{rev.revisionNumber}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Due: {format(parseISO(rev.dueDate), 'MMM d')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <div key={s} className="w-1.5 h-4 rounded-full" style={{ background: s <= (rev.confidence || 0) ? color : 'var(--border)' }} />
                  ))}
                </div>
                <button onClick={() => { setCompleteModal(rev); setConfidence(3) }}
                  className="px-3 py-1.5 text-xs rounded-xl font-medium"
                  style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>
                  Mark Done
                </button>
                <button onClick={() => { dispatch(rescheduleRevision({ id: rev.id, date: fmt(addDays(new Date(), 1), 'yyyy-MM-dd') })); toast.success('Rescheduled') }}
                  className="px-3 py-1.5 text-xs rounded-xl font-medium"
                  style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)' }}>
                  Reschedule
                </button>
                <button onClick={() => { dispatch(deleteRevision(rev.id)); toast.success('Removed') }} className="p-1.5 rounded-lg text-xs" style={{ color: 'var(--text-muted)' }}>✕</button>
              </div>
            </motion.div>
          )
        })}
        {items.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>None in this category</p>}
      </div>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Revision Tracker</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Spaced repetition · {due.length + overdue.length} need review today</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={Plus}>Add Topic</Button>
      </div>

      {revisions.length === 0 ? (
        <EmptyState icon={RefreshCw} title="No revision topics yet" description="Add topics to track with spaced repetition." action={<Button onClick={() => setShowModal(true)} icon={Plus}>Add Topic</Button>} />
      ) : (
        <div className="space-y-8">
          {overdue.length > 0 && <Section title="Overdue" icon={AlertTriangle} items={overdue} color="var(--danger)" />}
          {due.length > 0 && <Section title="Due Today" icon={Clock} items={due} color="var(--warning)" />}
          <Section title="Upcoming" icon={Calendar} items={upcoming} color="var(--accent)" />
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Revision Topic">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Topic</label>
            <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. Integration Techniques"
              className="w-full px-3 py-2.5 text-sm rounded-xl input-focus" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Subject</label>
            <select value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>First Revision Date</label>
            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAdd}>Add Topic</Button>
          </div>
        </div>
      </Modal>

      {/* Complete Modal */}
      <Modal isOpen={!!completeModal} onClose={() => setCompleteModal(null)} title="How well do you know this?">
        <div className="space-y-4">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{completeModal?.topic}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Rate your confidence (affects next review interval)</p>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(r => (
              <button key={r} onClick={() => setConfidence(r)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: r <= confidence ? 'var(--accent)' : 'var(--bg-surface-2)', color: r <= confidence ? 'var(--text-inverse)' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {r}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Forgot completely</span><span>Remember perfectly</span>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setCompleteModal(null)}>Cancel</Button>
            <Button className="flex-1" onClick={handleComplete}>Complete Revision</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
