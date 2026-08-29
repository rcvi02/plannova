import { useState, useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Plus, Search, Pin, Star, Trash2, StickyNote, Tag } from 'lucide-react'
import { addNote, updateNote, deleteNote, togglePin, toggleFavorite } from '@/features/notesSlice'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { EmptyState } from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { format, parseISO } from 'date-fns'
import { debounce } from '@/utils/helpers'
import toast from 'react-hot-toast'

const TOOLBAR_ACTIONS = [
  { label: 'B', command: 'toggleBold', title: 'Bold' },
  { label: 'I', command: 'toggleItalic', title: 'Italic' },
  { label: 'U', command: 'toggleUnderline', title: 'Underline' },
  { label: '•', command: 'toggleBulletList', title: 'Bullet List' },
  { label: '1.', command: 'toggleOrderedList', title: 'Numbered List' },
]

function NoteEditor({ note, onUpdate }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your notes...' }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: note?.content || '',
    onUpdate: ({ editor }) => {
      debouncedSave(editor.getHTML())
    },
  }, [note?.id])

  const debouncedSave = useCallback(debounce((html) => {
    onUpdate(html)
  }, 800), [note?.id])

  useEffect(() => {
    if (editor && note) {
      const current = editor.getHTML()
      if (current !== note.content) {
        editor.commands.setContent(note.content || '', false)
      }
    }
  }, [note?.id])

  if (!editor) return null

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        {TOOLBAR_ACTIONS.map(action => (
          <button
            key={action.label}
            onClick={() => editor.chain().focus()[action.command]().run()}
            title={action.title}
            className="px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: editor.isActive(action.command.replace('toggle', '').toLowerCase()) ? 'var(--accent-soft)' : 'transparent',
              color: editor.isActive(action.command.replace('toggle', '').toLowerCase()) ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            {action.label}
          </button>
        ))}
        <div className="w-px h-4 mx-1" style={{ background: 'var(--border)' }} />
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="px-2.5 py-1.5 rounded-lg text-xs font-bold" style={{ color: 'var(--text-muted)' }}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2.5 py-1.5 rounded-lg text-xs font-bold" style={{ color: 'var(--text-muted)' }}>H2</button>
      </div>
      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-6">
        <EditorContent editor={editor} className="min-h-full" />
      </div>
    </div>
  )
}

export default function NotesPage() {
  const dispatch = useDispatch()
  const notes = useSelector(s => s.notes.items)
  const subjects = useSelector(s => s.subjects.items)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(notes[0]?.id || null)
  const [filterSubject, setFilterSubject] = useState('all')
  const [filterFav, setFilterFav] = useState(false)
  const [autosaveIndicator, setAutosaveIndicator] = useState(false)
  const [pendingNewNote, setPendingNewNote] = useState(false)

  // When a new note is added, select it
  useEffect(() => {
    if (pendingNewNote && notes.length > 0) {
      setSelectedId(notes[0].id)
      setPendingNewNote(false)
    }
  }, [notes, pendingNewNote])

  const selectedNote = notes.find(n => n.id === selectedId)

  const filtered = notes.filter(n => {
    if (search && !n.title?.toLowerCase().includes(search.toLowerCase()) && !n.content?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterSubject !== 'all' && n.subjectId !== filterSubject) return false
    if (filterFav && !n.favorite) return false
    return true
  }).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })

  const handleNewNote = () => {
    dispatch(addNote({ title: 'Untitled Note', content: '' }))
    setPendingNewNote(true)
  }

  const handleContentUpdate = (html) => {
    if (!selectedId) return
    dispatch(updateNote({ id: selectedId, content: html }))
    setAutosaveIndicator(true)
    setTimeout(() => setAutosaveIndicator(false), 1500)
  }

  const handleTitleEdit = (e) => {
    if (!selectedId) return
    dispatch(updateNote({ id: selectedId, title: e.target.value }))
  }

  const getSubject = id => subjects.find(s => s.id === id)

  return (
    <div className="flex h-full overflow-hidden pb-16 lg:pb-0">
      {/* Left Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        {/* Header */}
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Notes</h1>
            <button onClick={handleNewNote} className="w-8 h-8 rounded-xl flex items-center justify-center btn-primary">
              <Plus size={15} />
            </button>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setFilterFav(!filterFav)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs" style={{ background: filterFav ? 'var(--warning-soft)' : 'var(--bg-surface-2)', color: filterFav ? 'var(--warning)' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
              <Star size={11} /> Favorites
            </button>
            <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="flex-1 px-2 py-1 rounded-lg text-xs" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', color: 'var(--text-muted)', outline: 'none' }}>
              <option value="all">All Subjects</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>No notes found</p>
          ) : (
            filtered.map(note => {
              const sub = getSubject(note.subjectId)
              const isSelected = note.id === selectedId
              return (
                <button key={note.id} onClick={() => setSelectedId(note.id)} className="w-full text-left p-4 border-b transition-colors"
                  style={{ borderColor: 'var(--border-subtle)', background: isSelected ? 'var(--accent-soft)' : 'transparent' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {note.pinned && <Pin size={10} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
                        <p className="text-sm font-medium truncate" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>{note.title}</p>
                      </div>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }} dangerouslySetInnerHTML={{ __html: note.content?.replace(/<[^>]+>/g, '').slice(0, 60) + '...' || '' }} />
                      <div className="flex items-center gap-2 mt-1.5">
                        {sub && <span className="text-[10px]" style={{ color: sub.color }}>● {sub.name}</span>}
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{format(parseISO(note.updatedAt), 'MMM d')}</span>
                      </div>
                    </div>
                    {note.favorite && <Star size={10} fill="var(--warning)" style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} />}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedNote ? (
          <>
            {/* Note Header */}
            <div className="flex items-center gap-3 px-6 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
              <input
                value={selectedNote.title}
                onChange={handleTitleEdit}
                className="flex-1 text-xl font-bold bg-transparent outline-none"
                style={{ color: 'var(--text-primary)' }}
                placeholder="Note title..."
              />
              <div className="flex items-center gap-2">
                {autosaveIndicator && <span className="text-xs" style={{ color: 'var(--success)' }}>Saved ✓</span>}
                <button onClick={() => dispatch(togglePin(selectedNote.id))} className="p-1.5 rounded-lg" style={{ color: selectedNote.pinned ? 'var(--accent)' : 'var(--text-muted)', background: selectedNote.pinned ? 'var(--accent-soft)' : 'transparent' }}>
                  <Pin size={14} />
                </button>
                <button onClick={() => dispatch(toggleFavorite(selectedNote.id))} className="p-1.5 rounded-lg" style={{ color: selectedNote.favorite ? 'var(--warning)' : 'var(--text-muted)', background: selectedNote.favorite ? 'var(--warning-soft)' : 'transparent' }}>
                  <Star size={14} />
                </button>
                <button onClick={() => { dispatch(deleteNote(selectedNote.id)); setSelectedId(notes.find(n => n.id !== selectedNote.id)?.id || null); toast.success('Note deleted') }}
                  className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <NoteEditor key={selectedNote.id} note={selectedNote} onUpdate={handleContentUpdate} />
            </div>
          </>
        ) : (
          <EmptyState icon={StickyNote} title="Select a note or create one" description="Your notes will appear here." action={<Button onClick={handleNewNote} icon={Plus}>New Note</Button>} className="h-full" />
        )}
      </div>
    </div>
  )
}
