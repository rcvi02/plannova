import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, parseISO, differenceInDays } from 'date-fns'
import { Plus, GraduationCap, Clock, Edit2, Trash2, ChevronRight } from 'lucide-react'
import { addExam, deleteExam } from '@/features/examsSlice'
import { ProgressBar } from '@/components/ui/ProgressRing'
import { EmptyState } from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { getDaysUntilExam, getProgressColor } from '@/utils/helpers'
import { format as fmt } from 'date-fns'
import toast from 'react-hot-toast'

export default function ExamsPage() {
  const dispatch = useDispatch()
  const exams = useSelector(s => s.exams.items)
  const subjects = useSelector(s => s.subjects.items)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', subjectId: '', date: '', targetScore: 80, priority: 'medium', syllabus: '', notes: '' })

  const today = fmt(new Date(), 'yyyy-MM-dd')
  const upcoming = exams.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = exams.filter(e => e.date < today)

  const getSubject = (id) => subjects.find(s => s.id === id)

  const handleSave = () => {
    if (!form.name || !form.date) return toast.error('Exam name and date are required')
    dispatch(addExam({
      ...form,
      syllabus: form.syllabus ? form.syllabus.split(',').map(s => s.trim()) : [],
      completedSyllabus: [],
      prepProgress: 0,
    }))
    toast.success('Exam added!')
    setShowModal(false)
    setForm({ name: '', subjectId: '', date: '', targetScore: 80, priority: 'medium', syllabus: '', notes: '' })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Exams</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{upcoming.length} upcoming</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={Plus}>Add Exam</Button>
      </div>

      {exams.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No exams scheduled" description="Add your upcoming exams to track preparation progress." action={<Button onClick={() => setShowModal(true)} icon={Plus}>Add Exam</Button>} />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>Upcoming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {upcoming.map((exam, i) => (
                  <ExamCard key={exam.id} exam={exam} subject={getSubject(exam.subjectId)} index={i} dispatch={dispatch} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>Past Exams</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {past.map((exam, i) => (
                  <ExamCard key={exam.id} exam={exam} subject={getSubject(exam.subjectId)} index={i} dispatch={dispatch} isPast />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Exam">
        <div className="space-y-4">
          {[
            { label: 'Exam Name', field: 'name', type: 'text', placeholder: 'e.g. Mathematics Final' },
            { label: 'Exam Date', field: 'date', type: 'date' },
            { label: 'Target Score (%)', field: 'targetScore', type: 'number' },
          ].map(f => (
            <div key={f.field}>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>{f.label}</label>
              <input type={f.type} value={form[f.field]} placeholder={f.placeholder} onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm rounded-xl input-focus" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Subject</label>
            <select value={form.subjectId} onChange={e => setForm(p => ({ ...p, subjectId: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Syllabus (comma separated)</label>
            <input value={form.syllabus} onChange={e => setForm(p => ({ ...p, syllabus: e.target.value }))} placeholder="Topic 1, Topic 2, Topic 3"
              className="w-full px-3 py-2.5 text-sm rounded-xl input-focus" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>Add Exam</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function ExamCard({ exam, subject, index, dispatch, isPast }) {
  const days = getDaysUntilExam(exam.date)
  const isUrgent = days <= 7 && !isPast
  const color = isUrgent ? 'var(--danger)' : isPast ? 'var(--text-muted)' : 'var(--accent)'
  const softBg = isUrgent ? 'var(--danger-soft)' : isPast ? 'var(--bg-surface-2)' : 'var(--accent-soft)'

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="rounded-2xl overflow-hidden card-hover" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {subject && <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: subject.colorSoft || subject.color + '18' }}>{subject.icon}</div>}
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subject?.name || 'General'}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{format(parseISO(exam.date), 'MMM d, yyyy')}</p>
            </div>
          </div>
          <div className="text-center px-3 py-1 rounded-xl" style={{ background: softBg }}>
            <p className="text-lg font-bold leading-none" style={{ color }}>{isPast ? 'Done' : `${days}d`}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{isPast ? 'Past' : 'left'}</p>
          </div>
        </div>

        <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{exam.name}</h3>

        <div className="flex items-center justify-between text-xs mb-2">
          <span style={{ color: 'var(--text-muted)' }}>Preparation</span>
          <span className="font-semibold" style={{ color: getProgressColor(exam.prepProgress) }}>{exam.prepProgress}%</span>
        </div>
        <ProgressBar percent={exam.prepProgress} color={getProgressColor(exam.prepProgress)} height={5} />

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Target: {exam.targetScore}%</span>
          <div className="flex items-center gap-1">
            <Link to={`/app/exams/${exam.id}`} className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--accent)' }}>
              Details <ChevronRight size={11} />
            </Link>
            <button onClick={() => { dispatch(deleteExam(exam.id)); toast.success('Exam removed') }} className="p-1.5 rounded-lg ml-1" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
