import { cn } from '@/utils/helpers'

export default function Badge({ children, variant = 'default', size = 'sm', className }) {
  const variants = {
    default: { background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    primary: { background: 'var(--accent-soft)', color: 'var(--accent)' },
    success: { background: 'var(--success-soft)', color: 'var(--success)' },
    warning: { background: 'var(--warning-soft)', color: 'var(--warning)' },
    danger: { background: 'var(--danger-soft)', color: 'var(--danger)' },
    sky: { background: 'var(--accent-2-soft)', color: 'var(--accent-2)' },
  }

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  return (
    <span
      className={cn('badge', sizes[size], className)}
      style={variants[variant]}
    >
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const map = {
    high: { label: 'High', variant: 'danger' },
    medium: { label: 'Medium', variant: 'warning' },
    low: { label: 'Low', variant: 'success' },
  }
  const { label, variant } = map[priority] || map.medium
  return <Badge variant={variant} size="xs">{label}</Badge>
}

export function StatusBadge({ status }) {
  const map = {
    pending: { label: 'Pending', variant: 'default' },
    'in-progress': { label: 'In Progress', variant: 'sky' },
    completed: { label: 'Completed', variant: 'success' },
    missed: { label: 'Missed', variant: 'danger' },
    due: { label: 'Due Today', variant: 'warning' },
    overdue: { label: 'Overdue', variant: 'danger' },
    upcoming: { label: 'Upcoming', variant: 'sky' },
  }
  const { label, variant } = map[status] || map.pending
  return <Badge variant={variant} size="xs">{label}</Badge>
}
