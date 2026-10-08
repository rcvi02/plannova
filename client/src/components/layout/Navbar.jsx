import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Sun, Moon, Monitor, ChevronDown, LogOut, Settings, User, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { setTheme } from '@/features/themeSlice'
import { setCommandPalette } from '@/features/uiSlice'
import { logout } from '@/features/authSlice'
import { cn } from '@/utils/helpers'
import toast from 'react-hot-toast'

const PAGE_TITLES = {
  '/app/dashboard': 'Dashboard',
  '/app/today':     'Today',
  '/app/planner':   'Planner',
  '/app/calendar':  'Calendar',
  '/app/subjects':  'Subjects',
  '/app/tasks':     'Tasks',
  '/app/exams':     'Exams',
  '/app/timer':     'Focus Timer',
  '/app/sessions':  'Study Sessions',
  '/app/notes':     'Notes',
  '/app/revision':  'Revision',
  '/app/goals':     'Goals',
  '/app/habits':    'Habits',
  '/app/analytics': 'Analytics',
  '/app/settings':  'Settings',
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(s => s.auth.user)
  const themeMode = useSelector(s => s.theme.mode)
  const notifications = useSelector(s => s.ui.notifications)
  const [profileOpen, setProfileOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const profileRef = useRef(null)
  const themeRef = useRef(null)
  const notifRef = useRef(null)

  const pageTitle = PAGE_TITLES[location.pathname] || location.pathname.split('/').pop() || 'Plannova'
  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (themeRef.current   && !themeRef.current.contains(e.target))   setThemeOpen(false)
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const themeOptions = [
    { value: 'light',  icon: Sun,     label: 'Light'  },
    { value: 'dark',   icon: Moon,    label: 'Dark'   },
    { value: 'system', icon: Monitor, label: 'System' },
  ]

  const ThemeIcon = themeOptions.find(t => t.value === themeMode)?.icon || Monitor

  return (
    <header
      className="flex items-center gap-3 px-4 lg:px-6 2xl:px-10 flex-shrink-0 navbar-glass"
      style={{
        height: 60,
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Page Title */}
      <div className="hidden lg:block mr-2 flex-shrink-0">
        <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{pageTitle}</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {format(new Date(), 'EEE, MMM d')}
        </p>
      </div>

      {/* Mobile page title */}
      <div className="lg:hidden font-bold text-sm ml-10 truncate max-w-[120px] sm:max-w-none" style={{ color: 'var(--text-primary)' }}>
        {pageTitle}
      </div>

      {/* Search Bar */}
      <button
        id="command-palette-btn"
        onClick={() => dispatch(setCommandPalette(true))}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all flex-1 max-w-sm text-left"
        style={{
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
          fontSize: '0.8125rem',
        }}
        aria-label="Open command palette"
      >
        <Search size={14} className="flex-shrink-0" />
        <span className="hidden sm:block flex-1 truncate">Search anything...</span>
        <div className="ml-auto hidden md:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: 'var(--bg-surface-3)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            ⌘K
          </kbd>
        </div>
      </button>

      <div className="flex items-center gap-1 ml-auto">
        {/* Help / Tour */}
        <button
          onClick={() => {
            localStorage.removeItem('plannova-tour-seen')
            sessionStorage.setItem('plannova-new-user', 'true')
            window.location.reload()
          }}
          className="p-2 rounded-xl transition-colors flex-shrink-0"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Start Product Tour"
          title="Start Tour"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl transition-colors flex-shrink-0"
            style={{ color: 'var(--text-secondary)', background: notifOpen ? 'var(--bg-hover)' : 'transparent' }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 pulse-dot" />
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50 glass-surface"
              >
                <div className="flex items-center justify-between p-4 relative z-10" style={{ borderBottom: '1px solid var(--border)' }}>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</p>
                  {unreadCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                
                <div className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  {/* Glowing ambient background orbs */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[var(--accent)] rounded-full mix-blend-screen filter blur-[40px] opacity-20"></div>
                  
                  <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300 shadow-lg" 
                       style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
                    <CheckCircle2 size={26} strokeWidth={2} />
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-sm font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>Inbox Zero</p>
                    <p className="text-xs leading-relaxed max-w-[200px] mx-auto" style={{ color: 'var(--text-muted)' }}>
                      You're completely caught up. Go focus on what matters!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <div className="relative" ref={themeRef}>
          <button
            id="theme-toggle-btn"
            onClick={() => setThemeOpen(!themeOpen)}
            className="p-2 rounded-xl transition-colors flex-shrink-0"
            style={{ color: 'var(--text-secondary)', background: themeOpen ? 'var(--bg-hover)' : 'transparent' }}
            aria-label="Change theme"
          >
            <ThemeIcon size={18} />
          </button>
          <AnimatePresence>
            {themeOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-44 rounded-2xl overflow-hidden z-50 p-1.5"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}
              >
                {themeOptions.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => { dispatch(setTheme(value)); setThemeOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left"
                    style={{
                      background: themeMode === value ? 'var(--accent-soft)' : 'transparent',
                      color:      themeMode === value ? 'var(--accent)'      : 'var(--text-secondary)',
                    }}
                  >
                    <Icon size={15} />
                    {label}
                    {themeMode === value && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            id="profile-menu-btn"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl transition-colors"
            style={{ background: profileOpen ? 'var(--bg-hover)' : 'transparent' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-page)' }}
            >
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <span className="hidden sm:block text-sm font-medium max-w-[80px] truncate" style={{ color: 'var(--text-primary)' }}>
              {user?.name?.split(' ')[0]}
            </span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50 p-1.5"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}
              >
                {/* User info */}
                <div className="px-3 py-3 mb-1 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: 'var(--text-primary)', color: 'var(--bg-page)' }}
                  >
                    {user?.name?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                  </div>
                </div>

                {[
                  { icon: User,     label: 'Profile',  path: '/app/settings' },
                  { icon: Settings, label: 'Settings', path: '/app/settings' },
                ].map(item => (
                  <button key={item.label}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => { navigate(item.path); setProfileOpen(false) }}
                  >
                    <item.icon size={15} />
                    {item.label}
                  </button>
                ))}

                <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
                  <button
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: 'var(--danger)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => {
                      dispatch(logout())
                      navigate('/')
                      toast.success('Signed out successfully')
                      setProfileOpen(false)
                    }}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
