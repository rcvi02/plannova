import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, CheckSquare, Square, Clock } from 'lucide-react'
import { toggleSyllabusItem } from '@/features/examsSlice'
import ProgressRing from '@/components/ui/ProgressRing'
import { ProgressBar } from '@/components/ui/ProgressRing'
import { getDaysUntilExam, getProgressColor } from '@/utils/helpers'

export default function ExamDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const exam = useSelector(s => s.exams.items.find(e => e.id === id))
  const subjects = useSelector(s => s.subjects.items)

  if (!exam) return <div className="flex items-center justify-center h-full"><Link to="/app/exams" className="btn btn-primary">Back to Exams</Link></div>

  const subject = subjects.find(s => s.id === exam.subjectId)
  const days = getDaysUntilExam(exam.date)
  const isUrgent = days <= 7
  const isPast = days < 0

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link to="/app/exams" className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Exams
      </Link>

      {/* Countdown Banner */}
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: isUrgent ? 'var(--danger-soft)' : 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{subject?.name}</p>
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{exam.name}</h1>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock size={16} style={{ color: isUrgent ? 'var(--danger)' : 'var(--accent)' }} />
          <span className="text-5xl font-black" style={{ color: isUrgent ? 'var(--danger)' : 'var(--accent)' }}>
            {isPast ? 'Past' : days}
          </span>
          {!isPast && <span className="text-xl font-medium" style={{ color: 'var(--text-secondary)' }}>days left</span>}
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {format(parseISO(exam.date), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Syllabus */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Syllabus Checklist</h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{exam.completedSyllabus?.length}/{exam.syllabus?.length} covered</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {exam.syllabus?.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No syllabus added yet</p>
            ) : (
              exam.syllabus?.map(item => {
                const done = exam.completedSyllabus?.includes(item)
                return (
                  <div key={item} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                    onClick={() => dispatch(toggleSyllabusItem({ examId: id, item }))}>
                    {done ? <CheckSquare size={18} style={{ color: 'var(--success)' }} /> : <Square size={18} style={{ color: 'var(--border)' }} />}
                    <span className="text-sm flex-1" style={{ color: done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: done ? 'line-through' : 'none' }}>{item}</span>
                    {done && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>Done</span>}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5 flex flex-col items-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <ProgressRing percent={exam.prepProgress} size={100} strokeWidth={8} color={getProgressColor(exam.prepProgress)}>
              <span className="text-xl font-bold" style={{ color: getProgressColor(exam.prepProgress) }}>{exam.prepProgress}%</span>
            </ProgressRing>
            <p className="text-sm font-medium mt-3" style={{ color: 'var(--text-primary)' }}>Preparation</p>
          </div>

          <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            {[
              { label: 'Target Score', value: `${exam.targetScore}%` },
              { label: 'Priority', value: exam.priority },
              { label: 'Subject', value: subject?.name || '—' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center justify-between">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                <p className="text-sm font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {exam.notes && (
            <div className="rounded-2xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Notes</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{exam.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
