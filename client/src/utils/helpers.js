import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatMinutes(minutes) {
  const m = Math.max(0, Math.floor(minutes || 0))
  const h = Math.floor(m / 60)
  const rem = m % 60
  if (h === 0) return `${rem}m`
  if (rem === 0) return `${h}h`
  return `${h}h ${rem}m`
}

export function formatSeconds(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function getPriorityConfig(priority) {
  const map = {
    high: { label: 'High', color: '#F43F5E', bg: '#FFE4E6', darkBg: '#2D1018', dot: 'bg-rose-500' },
    medium: { label: 'Medium', color: '#F59E0B', bg: '#FEF3C7', darkBg: '#2A1F08', dot: 'bg-amber-500' },
    low: { label: 'Low', color: '#10B981', bg: '#D1FAE5', darkBg: '#0D2218', dot: 'bg-emerald-500' },
  }
  return map[priority] || map.medium
}

export function getStatusConfig(status) {
  const map = {
    pending: { label: 'Pending', color: '#6B7280', bg: '#F3F4F6' },
    'in-progress': { label: 'In Progress', color: '#0EA5E9', bg: '#E0F2FE' },
    completed: { label: 'Completed', color: '#10B981', bg: '#D1FAE5' },
    missed: { label: 'Missed', color: '#F43F5E', bg: '#FFE4E6' },
  }
  return map[status] || map.pending
}

export function getRelativeTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0) return `In ${diffDays} days`
  return `${Math.abs(diffDays)} days ago`
}

export function getDaysUntilExam(dateStr) {
  const examDate = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  examDate.setHours(0, 0, 0, 0)
  return Math.ceil((examDate - today) / (1000 * 60 * 60 * 24))
}

export function getProgressColor(percent) {
  if (percent >= 80) return '#10B981'
  if (percent >= 50) return '#F59E0B'
  return '#F43F5E'
}

export function truncate(str, len = 60) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}

export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getMotivationalQuote() {
  const quotes = [
    'The secret of getting ahead is getting started.',
    'It does not matter how slowly you go as long as you do not stop.',
    'Success is the sum of small efforts repeated day in and day out.',
    'Don\'t watch the clock; do what it does. Keep going.',
    'The expert in anything was once a beginner.',
    'Push yourself, because no one else is going to do it for you.',
    'Great things never came from comfort zones.',
    'Dream it. Believe it. Build it.',
    'Study hard what interests you the most in the most undisciplined way.',
    'Education is the passport to the future.',
  ]
  return quotes[new Date().getDay() % quotes.length]
}
