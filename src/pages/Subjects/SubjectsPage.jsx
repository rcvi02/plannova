import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, Search, Grid, List, Archive, Edit2, Trash2, BookOpen } from 'lucide-react'
import { deleteSubjectAPI as deleteSubject, updateSubjectAPI } from '@/features/subjectsSlice'
import ProgressRing from '@/components/ui/ProgressRing'
import { ProgressBar } from '@/components/ui/ProgressRing'
import { EmptyState } from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { createSubject as addSubject, updateSubjectAPI as updateSubject } from '@/features/subjectsSlice'
import { SUBJECT_COLORS } from '@/utils/seedData'
import toast from 'react-hot-toast'
import { nanoid } from '@reduxjs/toolkit'

const ICONS = ['📐', '⚛️', '🧪', '🔬', '📚', '💻', '🌍', '🎨', '🏛️', '📊', '🧬', '🎵']

export default function SubjectsPage() {
  const dispatch = useDispatch()
  const subjects = useSelector(s => s.subjects.items).filter(s => !s.archived)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [showModal, setShowModal] = useState(false)
  const [editSubject, setEditSubject] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '📚', color: SUBJECT_COLORS[0].bg, colorSoft: SUBJECT_COLORS[0].soft, description: '', priority: 'medium', totalChapters: 10 })

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('Subject name is required')
    if (editSubject) {
      dispatch(updateSubject({ id: editSubject.id, ...form }))
      toast.success('Subject updated!')
    } else {
      dispatch(addSubject(form))
      toast.success('Subject added!')
    }
    setShowModal(false)
    setEditSubject(null)
    setForm({ name: '', icon: '📚', color: SUBJECT_COLORS[0].bg, colorSoft: SUBJECT_COLORS[0].soft, description: '', priority: 'medium', totalChapters: 10 })
  }

  const handleEdit = (subject) => {
    setEditSubject(subject)
    setForm({ name: subject.name, icon: subject.icon, color: subject.color, colorSoft: subject.colorSoft, description: subject.description || '', priority: subject.priority, totalChapters: subject.totalChapters })
    setShowModal(true)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Subjects</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{subjects.length} subjects · Track your progress</p>
        </div>
        <Button onClick={() => { setEditSubject(null); setShowModal(true) }} icon={Plus}>Add Subject</Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subjects..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl input-focus" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
        </div>
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => setViewMode('grid')} className="p-2 transition-colors" style={{ background: viewMode === 'grid' ? 'var(--accent-soft)' : 'var(--bg-surface)', color: viewMode === 'grid' ? 'var(--accent)' : 'var(--text-muted)' }}><Grid size={16} /></button>
          <button onClick={() => setViewMode('list')} className="p-2 transition-colors" style={{ background: viewMode === 'list' ? 'var(--accent-soft)' : 'var(--bg-surface)', color: viewMode === 'list' ? 'var(--accent)' : 'var(--text-muted)' }}><List size={16} /></button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No subjects yet" description="Add your first subject to start tracking your study progress." action={<Button onClick={() => setShowModal(true)} icon={Plus}>Add Subject</Button>} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((subject, i) => (
            <SubjectCard key={subject.id} subject={subject} index={i} onEdit={handleEdit} dispatch={dispatch} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(subject => (
            <SubjectListItem key={subject.id} subject={subject} onEdit={handleEdit} dispatch={dispatch} />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editSubject ? 'Edit Subject' : 'Add Subject'}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Subject Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Mathematics" className="w-full px-3 py-2.5 text-sm rounded-xl input-focus"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(icon => (
                <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))} className="w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-colors"
                  style={{ background: form.icon === icon ? 'var(--accent-soft)' : 'var(--bg-surface-2)', border: form.icon === icon ? '2px solid var(--accent)' : '1px solid var(--border)' }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Color</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_COLORS.map(c => (
                <button key={c.bg} onClick={() => setForm(f => ({ ...f, color: c.bg, colorSoft: c.soft }))} className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                  style={{ background: c.bg, outline: form.color === c.bg ? `3px solid ${c.bg}` : 'none', outlineOffset: '2px' }} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Total Chapters</label>
            <input type="number" value={form.totalChapters} onChange={e => setForm(f => ({ ...f, totalChapters: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2.5 text-sm rounded-xl input-focus"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
              placeholder="Brief description..." className="w-full px-3 py-2.5 text-sm rounded-xl input-focus resize-none"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>{editSubject ? 'Update' : 'Add Subject'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function SubjectCard({ subject, index, onEdit, dispatch }) {
  const pct = subject.totalChapters > 0 ? Math.round((subject.completedChapters / subject.totalChapters) * 100) : 0
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="rounded-2xl p-5 card-hover" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: subject.colorSoft || subject.color + '18' }}>
          {subject.icon}
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(subject)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Edit2 size={13} />
          </button>
          <button onClick={() => { dispatch(updateSubjectAPI({ id: subject.id, data: { archived: true } })); toast.success('Subject archived') }} className="p-1.5 rounded-lg hover:opacity-100 transition-all" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Archive size={13} />
          </button>
        </div>
      </div>
      <Link to={`/app/subjects/${subject.id}`}>
        <h3 className="font-bold mb-0.5 hover:underline" style={{ color: 'var(--text-primary)' }}>{subject.name}</h3>
      </Link>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{subject.description || `${subject.totalChapters} chapters`}</p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{subject.completedChapters}/{subject.totalChapters} chapters</span>
        <span className="text-sm font-bold" style={{ color: subject.color }}>{pct}%</span>
      </div>
      <ProgressBar percent={pct} color={subject.color} height={5} />
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>⏱ {subject.studyHours}h studied</span>
        <span className="badge text-xs px-2 py-0.5 rounded-full" style={{ background: subject.priority === 'high' ? 'var(--danger-soft)' : subject.priority === 'medium' ? 'var(--warning-soft)' : 'var(--success-soft)', color: subject.priority === 'high' ? 'var(--danger)' : subject.priority === 'medium' ? 'var(--warning)' : 'var(--success)' }}>
          {subject.priority}
        </span>
      </div>
    </motion.div>
  )
}

function SubjectListItem({ subject, onEdit, dispatch }) {
  const pct = subject.totalChapters > 0 ? Math.round((subject.completedChapters / subject.totalChapters) * 100) : 0
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: subject.colorSoft || subject.color + '18' }}>
        {subject.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{subject.name}</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subject.completedChapters}/{subject.totalChapters} chapters · {subject.studyHours}h</p>
      </div>
      <div className="w-32"><ProgressBar percent={pct} color={subject.color} height={5} /></div>
      <span className="text-sm font-bold w-10 text-right" style={{ color: subject.color }}>{pct}%</span>
      <div className="flex gap-1">
        <button onClick={() => onEdit(subject)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Edit2 size={14} />
        </button>
        <button onClick={() => { dispatch(updateSubjectAPI({ id: subject.id, data: { archived: true } })); toast.success('Subject archived') }} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Archive size={14} />
        </button>
      </div>
    </div>
  )
}
