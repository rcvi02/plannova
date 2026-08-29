import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Palette, Bell, Clock, Shield, Sun, Moon, Monitor, LogOut, Save, Menu, X } from 'lucide-react'
import { setTheme } from '@/features/themeSlice'
import { updateProfile, logout } from '@/features/authSlice'
import { updateSettings } from '@/features/timerSlice'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const SECTIONS = ['Profile', 'Appearance', 'Notifications', 'Focus Timer', 'Data & Privacy']
const SECTION_ICONS = { Profile: User, Appearance: Palette, Notifications: Bell, 'Focus Timer': Clock, 'Data & Privacy': Shield }

const DEFAULT_NOTIFICATIONS = [
  { id: 'breakReminders', label: 'Break reminders', desc: 'Get notified when your break ends', checked: true },
  { id: 'sessionComplete', label: 'Session complete', desc: 'Celebrate when you finish a focus session', checked: true },
  { id: 'examCountdown', label: 'Exam countdown', desc: 'Daily reminder for upcoming exams', checked: false },
  { id: 'revisionDue', label: 'Revision due', desc: 'Notify when revision topics are due', checked: true },
  { id: 'habitStreaks', label: 'Habit streaks', desc: 'Remind you to maintain your habits', checked: false },
]

export default function SettingsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(s => s.auth.user)
  const themeMode = useSelector(s => s.theme.mode)
  const timerSettings = useSelector(s => s.timer.settings)
  const [activeSection, setActiveSection] = useState('Profile')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Fix field name: dailyStudyGoal is the canonical name (matches User model)
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    course: user?.course || '',
    college: user?.college || '',
    dailyStudyGoal: user?.dailyStudyGoal || user?.dailyGoalMinutes || 360,
  })
  const [timerForm, setTimerForm] = useState({ ...timerSettings })
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS)

  const handleSaveProfile = () => {
    dispatch(updateProfile(profileForm))
    toast.success('Profile saved!')
  }

  const handleSaveTimer = () => {
    dispatch(updateSettings(timerForm))
    toast.success('Timer settings saved!')
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    toast.success('Signed out successfully')
  }

  const toggleNotification = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, checked: !n.checked } : n))
    toast.success('Notification preference updated')
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
    setMobileMenuOpen(false)
  }

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* Mobile menu toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-16 left-4 z-50 w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        aria-label="Toggle settings menu"
      >
        {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Sidebar — hidden on mobile unless open */}
      <AnimatePresence>
        {(mobileMenuOpen || true) && (
          <motion.div
            className={`
              flex-shrink-0 p-4 border-r overflow-y-auto
              ${mobileMenuOpen
                ? 'fixed inset-y-0 left-0 z-40 w-72 shadow-2xl md:shadow-none md:static md:w-56'
                : 'hidden md:flex md:flex-col w-56'
              }
            `}
            style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
            initial={mobileMenuOpen ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-2 pt-2" style={{ color: 'var(--text-muted)' }}>Settings</p>
            {SECTIONS.map(section => {
              const Icon = SECTION_ICONS[section]
              return (
                <button key={section} onClick={() => handleSectionChange(section)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left mb-0.5"
                  style={{
                    background: activeSection === section ? 'var(--accent-soft)' : 'transparent',
                    color: activeSection === section ? 'var(--accent)' : 'var(--text-secondary)',
                  }}>
                  <Icon size={15} />
                  {section}
                </button>
              )
            })}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left"
                style={{ color: 'var(--danger)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <motion.div key={activeSection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
          <h1 className="text-xl font-bold mb-6 md:pl-0 pl-10" style={{ color: 'var(--text-primary)' }}>{activeSection}</h1>

          {activeSection === 'Profile' && (
            <div className="max-w-lg space-y-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                  style={{ background: 'var(--text-primary)' }}>
                  {user?.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                </div>
              </div>
              {[
                { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Your full name' },
                { label: 'Email', field: 'email', type: 'email', placeholder: 'your@email.com' },
                { label: 'Course / Degree', field: 'course', type: 'text', placeholder: 'e.g. B.Tech Computer Science' },
                { label: 'College / University', field: 'college', type: 'text', placeholder: 'e.g. IIT Delhi' },
              ].map(f => (
                <div key={f.field}>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>{f.label}</label>
                  <input type={f.type} value={profileForm[f.field] || ''} placeholder={f.placeholder}
                    onChange={e => setProfileForm(p => ({ ...p, [f.field]: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Daily Study Goal</label>
                <div className="flex items-center gap-3">
                  <input type="number" min={30} max={1440} value={profileForm.dailyStudyGoal}
                    onChange={e => setProfileForm(p => ({ ...p, dailyStudyGoal: parseInt(e.target.value) || 360 }))}
                    className="flex-1 px-3 py-2.5 text-sm rounded-xl"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>minutes/day</span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  = {Math.floor((profileForm.dailyStudyGoal || 360) / 60)}h {(profileForm.dailyStudyGoal || 360) % 60}m per day
                </p>
              </div>
              <Button onClick={handleSaveProfile} icon={Save}>Save Profile</Button>
            </div>
          )}

          {activeSection === 'Appearance' && (
            <div className="max-w-lg space-y-6">
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', icon: Sun, label: 'Light', preview: '#F8F7F4' },
                    { value: 'dark', icon: Moon, label: 'Dark', preview: '#0F1117' },
                    { value: 'system', icon: Monitor, label: 'System', preview: 'var(--border)' },
                  ].map(theme => (
                    <button key={theme.value} onClick={() => dispatch(setTheme(theme.value))}
                      className="rounded-2xl p-4 text-center transition-all border-2"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: themeMode === theme.value ? 'var(--accent)' : 'var(--border)',
                      }}>
                      <div className="w-10 h-10 rounded-xl mx-auto mb-2" style={{ background: theme.preview }} />
                      <theme.icon size={16} className="mx-auto mb-1" style={{ color: themeMode === theme.value ? 'var(--accent)' : 'var(--text-muted)' }} />
                      <p className="text-xs font-medium" style={{ color: themeMode === theme.value ? 'var(--accent)' : 'var(--text-secondary)' }}>{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Font</p>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Currently using Inter (Recommended)</p>
                <div className="px-4 py-3 rounded-xl" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>The quick brown fox jumps over the lazy dog</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Inter · Regular 400</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Notifications' && (
            <div className="max-w-lg space-y-4">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Control which in-app notifications you receive.</p>
              {notifications.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(item.id)}
                    className="w-11 h-6 rounded-full transition-colors relative flex-shrink-0"
                    style={{ background: item.checked ? 'var(--accent)' : 'var(--bg-surface-3)' }}
                    aria-label={item.checked ? `Disable ${item.label}` : `Enable ${item.label}`}
                    role="switch"
                    aria-checked={item.checked}
                  >
                    <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm"
                      style={{ left: item.checked ? 26 : 4 }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'Focus Timer' && (
            <div className="max-w-lg space-y-5">
              {[
                { label: 'Focus Duration', field: 'focusDuration', unit: 'min', min: 5, max: 120 },
                { label: 'Short Break', field: 'shortBreak', unit: 'min', min: 1, max: 30 },
                { label: 'Long Break', field: 'longBreak', unit: 'min', min: 5, max: 60 },
                { label: 'Long Break Interval', field: 'longBreakInterval', unit: 'sessions', min: 2, max: 10 },
              ].map(s => (
                <div key={s.field}>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>{s.label}</label>
                  <div className="flex items-center gap-3">
                    <input type="number" min={s.min} max={s.max} value={timerForm[s.field]}
                      onChange={e => setTimerForm(f => ({ ...f, [s.field]: parseInt(e.target.value) || s.min }))}
                      className="flex-1 px-3 py-2.5 text-sm rounded-xl"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.unit}</span>
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveTimer} icon={Save}>Save Timer Settings</Button>
            </div>
          )}

          {activeSection === 'Data & Privacy' && (
            <div className="max-w-lg space-y-4">
              <div className="rounded-xl p-4" style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>🔒 Your data stays local</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  All your study data is stored locally in your browser using Redux Persist + localStorage. Nothing is sent to any external server in demo mode.
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--warning-soft)', border: '1px solid var(--warning)30' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--warning)' }}>⚠️ Export your data first</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Clearing data is permanent and cannot be undone.</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure? This will delete ALL your study data and cannot be undone.')) {
                    localStorage.removeItem('studyflow-root')
                    toast.success('All data cleared. Refreshing...')
                    setTimeout(() => window.location.reload(), 1500)
                  }
                }}
                className="btn btn-danger text-sm">
                Clear All Data
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
