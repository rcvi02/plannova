import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, CalendarDays, ListTodo, Timer, BarChart3, BookOpen, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/helpers'

const BOTTOM_NAV = [
  { path: '/app/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/app/today',     icon: CalendarDays,    label: 'Today' },
  { path: '/app/timer',     icon: Timer,           label: 'Focus',  isPrimary: true },
  { path: '/app/tasks',     icon: ListTodo,        label: 'Tasks' },
  { path: '/app/analytics', icon: BarChart3,       label: 'Stats' },
]

export default function MobileBottomNav() {
  return (
    <nav
      className="bottom-nav lg:hidden"
      aria-label="Mobile navigation"
      style={{ background: 'var(--bg-surface)' }}
    >
      {BOTTOM_NAV.map(({ path, icon: Icon, label, isPrimary }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => cn(
            'flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl transition-all min-w-[52px] relative',
            isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
          )}
        >
          {({ isActive }) => (
            <>
              {isPrimary ? (
                /* Primary action button - Focus Timer */
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-0.5 shadow-lg"
                  style={{
                    background: 'var(--text-primary)',
                    boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                    marginTop: '-18px',
                  }}
                >
                  <Icon size={22} color="white" />
                </motion.div>
              ) : (
                <div className="relative flex flex-col items-center gap-0.5">
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                      isActive ? 'bg-[var(--accent-soft)]' : 'bg-transparent'
                    )}
                  >
                    <Icon size={19} />
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-indicator"
                      className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--accent)]"
                    />
                  )}
                </div>
              )}
              <span
                className={cn(
                  'text-[10px] font-semibold leading-none',
                  isPrimary ? 'text-[var(--accent)]' : ''
                )}
                style={{ marginTop: isPrimary ? '2px' : 0 }}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
