import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, LayoutDashboard, CalendarDays, ListTodo, Timer, BookOpen, BarChart3, Settings, StickyNote, Target, Activity, GraduationCap } from 'lucide-react'
import { setCommandPalette } from '@/features/uiSlice'

const COMMANDS = [
  { id: 'dashboard', label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, category: 'Pages' },
  { id: 'today', label: 'Today', path: '/app/today', icon: CalendarDays, category: 'Pages' },
  { id: 'tasks', label: 'Tasks', path: '/app/tasks', icon: ListTodo, category: 'Pages' },
  { id: 'timer', label: 'Focus Timer', path: '/app/timer', icon: Timer, category: 'Pages' },
  { id: 'subjects', label: 'Subjects', path: '/app/subjects', icon: BookOpen, category: 'Pages' },
  { id: 'exams', label: 'Exams', path: '/app/exams', icon: GraduationCap, category: 'Pages' },
  { id: 'analytics', label: 'Analytics', path: '/app/analytics', icon: BarChart3, category: 'Pages' },
  { id: 'notes', label: 'Notes', path: '/app/notes', icon: StickyNote, category: 'Pages' },
  { id: 'goals', label: 'Goals', path: '/app/goals', icon: Target, category: 'Pages' },
  { id: 'habits', label: 'Habits', path: '/app/habits', icon: Activity, category: 'Pages' },
  { id: 'settings', label: 'Settings', path: '/app/settings', icon: Settings, category: 'Pages' },
]

export default function CommandPalette() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef(null)
  const tasks = useSelector(s => s.tasks.items)
  const subjects = useSelector(s => s.subjects.items)
  const notes = useSelector(s => s.notes.items)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Build searchable items
  const allItems = [
    ...COMMANDS,
    ...tasks.slice(0, 20).map(t => ({ id: t.id, label: t.title, path: '/app/tasks', icon: ListTodo, category: 'Tasks' })),
    ...subjects.map(s => ({ id: s.id, label: s.name, path: `/app/subjects/${s.id}`, icon: BookOpen, category: 'Subjects' })),
    ...notes.slice(0, 10).map(n => ({ id: n.id, label: n.title, path: '/app/notes', icon: StickyNote, category: 'Notes' })),
  ]

  const filtered = query
    ? allItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const flatFiltered = Object.values(grouped).flat()

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  const handleSelect = (item) => {
    navigate(item.path)
    dispatch(setCommandPalette(false))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(i => Math.min(i + 1, flatFiltered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && flatFiltered[selectedIdx]) {
      handleSelect(flatFiltered[selectedIdx])
    } else if (e.key === 'Escape') {
      dispatch(setCommandPalette(false))
    }
  }

  let flatIdx = 0

  return (
    <div className="command-palette-backdrop" onClick={() => dispatch(setCommandPalette(false))}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -20 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-xl mx-auto mt-24 rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, tasks, subjects..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Command palette search"
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)' }}>
              <X size={15} />
            </button>
          )}
          <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {flatFiltered.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>No results for "{query}"</p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-2">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {category}
                </p>
                {items.map(item => {
                  const currentIdx = flatIdx++
                  const isSelected = selectedIdx === currentIdx
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                      style={{
                        background: isSelected ? 'var(--accent-soft)' : 'transparent',
                        color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                      }}
                    >
                      <item.icon size={16} style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }} />
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{category}</span>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5" style={{ borderTop: '1px solid var(--border)' }}>
          {[['↑↓', 'Navigate'], ['↵', 'Select'], ['ESC', 'Close']].map(([key, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{key}</kbd>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
