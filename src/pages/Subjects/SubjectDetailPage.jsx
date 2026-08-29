import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckSquare, Square, Clock, Target, BookOpen } from 'lucide-react'
import { toggleChapter } from '@/features/subjectsSlice'
import ProgressRing from '@/components/ui/ProgressRing'
import { ProgressBar } from '@/components/ui/ProgressRing'
import { selectSubjectById } from '@/features/subjectsSlice'

export default function SubjectDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const subject = useSelector(selectSubjectById(id))
  const tasks = useSelector(s => s.tasks.items.filter(t => t.subjectId === id))
  const sessions = useSelector(s => s.sessions.items.filter(s => s.subjectId === id))

  if (!subject) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Subject not found</p>
        <Link to="/app/subjects" className="btn btn-primary text-sm">Back to Subjects</Link>
      </div>
    </div>
  )

  const pct = subject.totalChapters > 0 ? Math.round((subject.completedChapters / subject.totalChapters) * 100) : 0
  const pendingTasks = tasks.filter(t => t.status !== 'completed')
  const totalStudyMins = sessions.reduce((a, s) => a + s.duration, 0)

  const defaultChapters = subject.chapters?.length > 0 ? subject.chapters : Array.from({ length: subject.totalChapters || 5 }, (_, i) => ({
    id: `ch${i}`, name: `Chapter ${i + 1}`, completed: i < (subject.completedChapters || 0), topics: []
  }))

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
      <Link to="/app/subjects" className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Subjects
      </Link>

      {/* Hero */}
      <div className="rounded-3xl p-8 mb-6" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl" style={{ background: subject.colorSoft || subject.color + '25' }}>
            {subject.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{subject.name}</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{subject.description}</p>
            <div className="flex items-center gap-6 mt-3">
              {[
                { label: 'Chapters', value: `${subject.completedChapters}/${subject.totalChapters}` },
                { label: 'Study Hours', value: `${subject.studyHours}h` },
                { label: 'Pending Tasks', value: pendingTasks.length },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-bold" style={{ color: subject.color }}>{s.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <ProgressRing percent={pct} size={100} strokeWidth={8} color={subject.color}>
            <span className="text-xl font-bold" style={{ color: subject.color }}>{pct}%</span>
          </ProgressRing>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapters */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Chapters</h2>
            </div>
            <div className="divide-y" style={{ '--tw-divide-opacity': 1 }}>
              {defaultChapters.map((ch, i) => (
                <div key={ch.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                  onClick={() => dispatch(toggleChapter({ subjectId: id, chapterId: ch.id }))}>
                  {ch.completed ? (
                    <CheckSquare size={18} style={{ color: subject.color, flexShrink: 0 }} />
                  ) : (
                    <Square size={18} style={{ color: 'var(--border)', flexShrink: 0 }} />
                  )}
                  <p className="text-sm flex-1 font-medium" style={{ color: ch.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: ch.completed ? 'line-through' : 'none' }}>
                    {ch.name}
                  </p>
                  {ch.completed && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>Done</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {[
            { label: 'Progress', value: `${pct}%`, icon: Target, color: subject.color },
            { label: 'Study Time', value: `${Math.floor(totalStudyMins / 60)}h ${totalStudyMins % 60}m`, icon: Clock, color: 'var(--accent-2)' },
            { label: 'Tasks Left', value: pendingTasks.length, icon: BookOpen, color: 'var(--warning)' },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: stat.color + '15' }}>
                  <stat.icon size={16} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Pending Tasks</p>
              </div>
              <div className="p-2">
                {pendingTasks.slice(0, 4).map(task => (
                  <div key={task.id} className="px-3 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    · {task.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
