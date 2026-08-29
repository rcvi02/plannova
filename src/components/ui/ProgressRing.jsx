import { cn } from '@/utils/helpers'

export default function ProgressRing({ percent = 0, size = 80, strokeWidth = 6, color, className, children }) {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference
  const ringColor = color || 'var(--accent)'

  return (
    <div className={cn('relative flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring-circle"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

export function ProgressBar({ percent = 0, color, height = 6, className, animated = true }) {
  const barColor = color || 'var(--accent)'
  return (
    <div
      className={cn('w-full rounded-full overflow-hidden', className)}
      style={{ height, background: 'var(--bg-surface-3)' }}
    >
      <div
        className={cn('h-full rounded-full', animated && 'transition-all duration-700 ease-out')}
        style={{ width: `${Math.min(percent, 100)}%`, background: barColor }}
      />
    </div>
  )
}
