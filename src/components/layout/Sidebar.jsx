import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, CalendarDays, BookOpen, ListTodo, GraduationCap,
  Timer, History, StickyNote, RefreshCw, Target, Activity,
  BarChart3, Settings, ChevronLeft, ChevronRight, Flame,
  X, Calendar, AlignLeft, TrendingUp
} from 'lucide-react'
import { toggleSidebar } from '@/features/themeSlice'
import { cn } from '@/utils/helpers'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/app/today',     icon: CalendarDays,    label: 'Today' },
      { path: '/app/planner',   icon: AlignLeft,       label: 'Planner' },
      { path: '/app/calendar',  icon: Calendar,        label: 'Calendar' },
    ],
  },
  {
    label: 'Study',
    items: [
      { path: '/app/subjects',  icon: BookOpen,       label: 'Subjects' },
      { path: '/app/tasks',     icon: ListTodo,       label: 'Tasks' },
      { path: '/app/exams',     icon: GraduationCap,  label: 'Exams' },
      { path: '/app/timer',     icon: Timer,          label: 'Focus Timer' },
      { path: '/app/sessions',  icon: History,        label: 'Sessions' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { path: '/app/notes',     icon: StickyNote,     label: 'Notes' },
      { path: '/app/revision',  icon: RefreshCw,      label: 'Revision' },
      { path: '/app/goals',     icon: Target,         label: 'Goals' },
      { path: '/app/habits',    icon: Activity,       label: 'Habits' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { path: '/app/analytics', icon: BarChart3,      label: 'Analytics' },
      { path: '/app/settings',  icon: Settings,       label: 'Settings' },
    ],
  },
]

export default function Sidebar() {
  const dispatch = useDispatch()
  const collapsed = useSelector(s => s.theme.sidebarCollapsed)
  const user = useSelector(s => s.auth.user)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 272 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col flex-shrink-0 h-full overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
        }}
      >
        <SidebarContent collapsed={collapsed} user={user} dispatch={dispatch} onClose={() => {}} />
      </motion.aside>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-40 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        aria-label="Open menu"
      >
        <AlignLeft size={18} />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden fixed top-0 left-0 h-full z-50 flex flex-col w-72"
              style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}
            >
              <SidebarContent collapsed={false} user={user} dispatch={dispatch} onClose={() => setMobileOpen(false)} showCloseButton />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function SidebarContent({ collapsed, user, dispatch, onClose, showCloseButton }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div
        className="flex items-center justify-between px-4 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: 'var(--text-primary)' }}
              >
                <BookOpen size={16} className="text-[var(--bg-page)]" />
              </div>
              <div>
                <span className="font-black text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  StudyFlow
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto shadow-sm"
            style={{ background: 'var(--text-primary)' }}
          >
            <BookOpen size={16} className="text-[var(--bg-page)]" />
          </div>
        )}

        <div className="flex items-center gap-1">
          {showCloseButton ? (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X size={18} />
            </button>
          ) : !collapsed ? (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          ) : (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-1.5 rounded-lg transition-colors mx-auto"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Expand sidebar"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Card */}
      <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <Link
          to="/app/settings"
          onClick={onClose}
          className={cn(
            'flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all group',
            'hover:bg-[var(--bg-hover)]'
          )}
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-sm"
            style={{ background: 'var(--text-primary)', color: 'var(--bg-page)' }}
          >
            {user?.name?.[0]?.toUpperCase() || 'S'}
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {user?.name || 'Student'}
                </p>
                <div className="flex items-center gap-1.5">
                  <Flame size={10} style={{ color: '#F59E0B' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    {user?.streak || 0} day streak
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </div>
  )
}

function NavItem({ item, collapsed, onClick }) {
  const { path, icon: Icon, label } = item

  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'sidebar-nav-item group',
          isActive && 'active',
          collapsed && 'justify-center px-2'
        )
      }
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={17}
            className="nav-icon flex-shrink-0 transition-colors"
            style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.12 }}
                className="truncate"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
          {/* Active indicator dot */}
          {isActive && !collapsed && (
            <motion.div
              layoutId="sidebar-active-dot"
              className="ml-auto w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          )}
        </>
      )}
    </NavLink>
  )
}
