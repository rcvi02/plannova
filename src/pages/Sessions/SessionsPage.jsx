import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { Plus, Edit2, Trash2, Clock, Star, History } from 'lucide-react'
import { addSession, updateSession, deleteSession } from '@/features/sessionsSlice'
import { EmptyState } from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { formatMinutes } from '@/utils/helpers'
import toast from 'react-hot-toast'

export default function SessionsPage() {
  const dispatch = useDispatch()
  const sessions = useSelector(s => s.sessions.items)
  const subjects = useSelector(s => s.subjects.items)
  const [showModal, setShowModal] = useState(false)
  const [editSess, setEditSess] = useState(null)
  const [form, setForm] = useState({ subjectId: '', date: format(new Date(), 'yyyy-MM-dd'), duration: 30, topic: '', rating: 4, notes: '' })

  const getSubject = id => subjects.find(s => s.id === id)

  const totalMins = sessions.reduce((a, s) => a + s.duration, 0)
  const avgRating = sessions.length > 0 ? (sessions.reduce((a, s) => a + (s.rating || 0), 0) / sessions.length).toFixed(1) : 0

  const grouped = sessions.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = []
    acc[s.date].push(s)
    return acc
  }, {})

  const handleSave = () => {
    if (editSess) {
      dispatch(updateSession({ id: editSess.id, ...form }))
      toast.success('Session updated!')
    } else {
      dispatch(addSession(form))
      toast.success('Session logged!')
    }
    setShowModal(false)
    setEditSess(null)
    setForm({ subjectId: '', date: format(new Date(), 'yyyy-MM-dd'), duration: 30, topic: '', rating: 4, notes: '' })
  }

  const handleEdit = (sess) => {
    setEditSess(sess)
    setForm({ subjectId: sess.subjectId || '', date: sess.date, duration: sess.duration, topic: sess.topic || '', rating: sess.rating || 4, notes: sess.notes || '' })
    setShowModal(true)
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Study Sessions</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{sessions.length} sessions · {formatMinutes(totalMins)} total</p>
        </div>
        <Button onClick={() => { setEditSess(null); setShowModal(true) }} icon={Plus}>Log Session</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sessions', value: sessions.length, color: 'var(--accent)' },
          { label: 'Total Time', value: formatMinutes(totalMins), color: 'var(--accent-2)' },
          { label: 'Avg. Duration', value: sessions.length > 0 ? formatMinutes(Math.round(totalMins / sessions.length)) : '—', color: 'var(--success)' },
          { label: 'Avg. Rating', value: `${avgRating}★`, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {sessions.length === 0 ? (
        <EmptyState icon={History} title="No sessions yet" description="Log your first study session to start tracking your progress." action={<Button onClick={() => setShowModal(true)} icon={Plus}>Log Session</Button>} />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, daySessions]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{format(parseISO(date), 'EEEE, MMMM d')}</p>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatMinutes(daySessions.reduce((a, s) => a + s.duration, 0))}</p>
              </div>
              <div className="space-y-2">
                {daySessions.map(sess => {
                  const sub = getSubject(sess.subjectId)
                  return (
                    <motion.div key={sess.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--bg-hover)] transition-colors group"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: sub?.colorSoft || 'var(--accent-soft)' }}>
                        <span className="text-xl">{sub?.icon || '📚'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{sub?.name || 'General Study'}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sess.topic || 'Study session'}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= sess.rating ? 'var(--warning)' : 'var(--border)', fontSize: 12 }}>★</span>)}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl" style={{ background: 'var(--accent-soft)' }}>
                        <Clock size={12} style={{ color: 'var(--accent)' }} />
                        <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{formatMinutes(sess.duration)}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(sess)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><Edit2 size={13} /></button>
                        <button onClick={() => { dispatch(deleteSession(sess.id)); toast.success('Session deleted') }} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><Trash2 size={13} /></button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editSess ? 'Edit Session' : 'Log Session'}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Subject</label>
            <select value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Duration (min)</label>
              <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Topic</label>
            <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="What did you study?" className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(r => (
                <button key={r} type="button" onClick={() => setForm(f => ({ ...f, rating: r }))}
                  className="text-2xl transition-transform hover:scale-110" style={{ color: r <= form.rating ? 'var(--warning)' : 'var(--border)' }}>★</button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>{editSess ? 'Update' : 'Log Session'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
