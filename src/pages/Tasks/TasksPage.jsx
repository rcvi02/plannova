import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Plus, Search, List, LayoutGrid, Trash2, Edit2, CheckCircle2, Circle, Filter } from 'lucide-react'
import { createTask, updateTask, deleteTask, fetchTasks } from '@/features/tasksSlice'
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatMinutes, getPriorityConfig } from '@/utils/helpers'
import { nanoid } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const STATUSES = ['pending', 'in-progress', 'completed', 'missed']
const STATUS_LABELS = { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed', missed: 'Missed' }
const STATUS_COLORS = { pending: 'var(--text-muted)', 'in-progress': 'var(--accent-2)', completed: 'var(--success)', missed: 'var(--danger)' }

export default function TasksPage() {
  const dispatch = useDispatch()
  const tasks = useSelector(s => s.tasks.items)
  const subjects = useSelector(s => s.subjects.items)
  const [view, setView] = useState('list')
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterSubject, setFilterSubject] = useState('all')
  const [activeTab, setActiveTab] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [form, setForm] = useState({ title: '', subjectId: '', priority: 'medium', status: 'pending', dueDate: format(new Date(), 'yyyy-MM-dd'), estimatedTime: 30 })

  const getSubject = (id) => subjects.find(s => s.id === id)

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false
      if (filterSubject !== 'all' && t.subjectId !== filterSubject) return false
      if (activeTab !== 'all' && t.status !== activeTab) return false
      return true
    })
  }, [tasks, search, filterPriority, filterSubject, activeTab])

  const handleSave = () => {
    if (!form.title.trim()) return toast.error('Task title is required')
    if (editTask) {
      dispatch(updateTask({ id: editTask.id, data: form }))
      toast.success('Task updated!')
    } else {
      dispatch(createTask(form))
      toast.success('Task added!')
    }
    setShowModal(false)
    setEditTask(null)
    setForm({ title: '', subjectId: '', priority: 'medium', status: 'pending', dueDate: format(new Date(), 'yyyy-MM-dd'), estimatedTime: 30 })
  }

  const handleEdit = (task) => {
    setEditTask(task)
    setForm({ title: task.title, subjectId: task.subjectId || '', priority: task.priority, status: task.status, dueDate: task.dueDate, estimatedTime: task.estimatedTime || 30 })
    setShowModal(true)
  }

  const tabs = [
    { key: 'all', label: 'All', count: tasks.length },
    { key: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
    { key: 'in-progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length },
    { key: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Tasks</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{tasks.filter(t => t.status !== 'completed').length} pending · {tasks.filter(t => t.status === 'completed').length} completed</p>
        </div>
        <Button onClick={() => { setEditTask(null); setShowModal(true) }} icon={Plus} className="w-full sm:w-auto">Add Task</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
            style={{ background: activeTab === tab.key ? 'var(--bg-surface)' : 'transparent', color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: activeTab === tab.key ? 'var(--shadow-sm)' : 'none' }}>
            {tab.label}
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: activeTab === tab.key ? 'var(--accent-soft)' : 'var(--bg-surface-3)', color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-muted)' }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
        <div className="relative w-full sm:flex-1 sm:min-w-[12rem]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl input-focus" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="flex-1 sm:flex-none px-3 py-2 text-sm rounded-xl cursor-pointer" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="flex-1 sm:flex-none px-3 py-2 text-sm rounded-xl cursor-pointer" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
            <option value="all">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex rounded-xl overflow-hidden border w-full sm:w-auto" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => setView('list')} className="flex-1 sm:flex-none p-2 flex justify-center" style={{ background: view === 'list' ? 'var(--accent-soft)' : 'var(--bg-surface)', color: view === 'list' ? 'var(--accent)' : 'var(--text-muted)' }}><List size={16} /></button>
          <button onClick={() => setView('board')} className="flex-1 sm:flex-none p-2 flex justify-center" style={{ background: view === 'board' ? 'var(--accent-soft)' : 'var(--bg-surface)', color: view === 'board' ? 'var(--accent)' : 'var(--text-muted)' }}><LayoutGrid size={16} /></button>
        </div>
      </div>

      {/* Views */}
      {view === 'board' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map(status => {
            const columnTasks = tasks.filter(t => t.status === status && (search ? t.title.toLowerCase().includes(search.toLowerCase()) : true))
            return (
              <div key={status} className="kanban-column flex-shrink-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[status] }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{STATUS_LABELS[status]}</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-surface-3)', color: 'var(--text-muted)' }}>{columnTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {columnTasks.map(task => {
                    const sub = getSubject(task.subjectId)
                    return (
                      <div key={task.id} className="p-3 rounded-xl cursor-pointer" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                        <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                        <div className="flex items-center justify-between">
                          {sub && <span className="text-xs" style={{ color: sub.color }}>● {sub.name}</span>}
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                    )
                  })}
                  {columnTasks.length === 0 && (
                    <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>No tasks</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="No tasks found" description="Try adjusting your filters or add a new task." />
          ) : (
            filtered.map((task, i) => {
              const sub = getSubject(task.subjectId)
              return (
                <motion.div key={task.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl hover:bg-[var(--bg-hover)] transition-colors group"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  
                  <div className="flex items-start sm:items-center gap-3 w-full sm:flex-1 min-w-0">
                    <button onClick={() => { dispatch(updateTask({ id: task.id, data: { status: task.status === 'completed' ? 'pending' : 'completed' } })); toast.success(task.status === 'completed' ? 'Task reopened' : 'Task completed!') }} className="flex-shrink-0 mt-0.5 sm:mt-0">
                      {task.status === 'completed'
                        ? <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                        : <Circle size={20} style={{ color: sub?.color || 'var(--border)' }} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', textDecoration: task.status === 'completed' ? 'line-through' : 'none', opacity: task.status === 'completed' ? 0.6 : 1, wordBreak: 'break-word' }}>{task.title}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        {sub && <span className="text-xs truncate max-w-[120px]" style={{ color: sub.color }}>● {sub.name}</span>}
                        <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{task.dueDate}</span>
                        {task.estimatedTime && <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{formatMinutes(task.estimatedTime)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pl-8 sm:pl-0 mt-2 sm:mt-0">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                    <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(task)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => { dispatch(deleteTask(task.id)); toast.success('Task deleted') }} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTask ? 'Edit Task' : 'Add Task'}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Task title..." className="w-full px-3 py-2.5 text-sm rounded-xl input-focus"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Subject</label>
              <select value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">None</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Est. Time (min)</label>
              <input type="number" value={form.estimatedTime} onChange={e => setForm(f => ({ ...f, estimatedTime: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>{editTask ? 'Update Task' : 'Add Task'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
