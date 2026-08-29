import { useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { parseISO } from 'date-fns'

export default function CalendarPage() {
  const calendarRef = useRef(null)
  const tasks = useSelector(s => s.tasks.items)
  const exams = useSelector(s => s.exams.items)
  const subjects = useSelector(s => s.subjects.items)
  const revisions = useSelector(s => s.revisions.items)
  const sessions = useSelector(s => s.sessions.items)

  const getSubject = (id) => subjects.find(s => s.id === id)

  const events = useMemo(() => {
    const evts = []

    tasks.forEach(t => {
      if (!t.dueDate) return
      const sub = getSubject(t.subjectId)
      evts.push({
        id: `task-${t.id}`,
        title: t.title,
        date: t.dueDate,
        backgroundColor: sub?.color || '#7C3AED',
        borderColor: 'transparent',
        textColor: '#fff',
        extendedProps: { type: 'task', priority: t.priority },
      })
    })

    exams.forEach(e => {
      const sub = getSubject(e.subjectId)
      evts.push({
        id: `exam-${e.id}`,
        title: `📝 ${e.name}`,
        date: e.date,
        backgroundColor: '#F43F5E',
        borderColor: 'transparent',
        textColor: '#fff',
        extendedProps: { type: 'exam' },
      })
    })

    revisions.forEach(r => {
      const sub = getSubject(r.subjectId)
      evts.push({
        id: `rev-${r.id}`,
        title: `🔄 ${r.topic}`,
        date: r.dueDate,
        backgroundColor: '#F59E0B',
        borderColor: 'transparent',
        textColor: '#fff',
        extendedProps: { type: 'revision' },
      })
    })

    sessions.slice(0, 20).forEach(s => {
      const sub = getSubject(s.subjectId)
      evts.push({
        id: `sess-${s.id}`,
        title: `⏱ ${sub?.name || 'Study'} session`,
        date: s.date,
        backgroundColor: '#10B981',
        borderColor: 'transparent',
        textColor: '#fff',
        extendedProps: { type: 'session' },
      })
    })

    return evts
  }, [tasks, exams, revisions, sessions, subjects])

  return (
    <div className="p-6 h-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-5">
        {[
          { color: '#7C3AED', label: 'Tasks' },
          { color: '#F43F5E', label: 'Exams' },
          { color: '#F59E0B', label: 'Revisions' },
          { color: '#10B981', label: 'Sessions' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '1rem' }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
          }}
          events={events}
          height="calc(100vh - 280px)"
          editable={true}
          selectable={true}
          dayMaxEvents={3}
          eventDisplay="block"
        />
      </div>
    </div>
  )
}
