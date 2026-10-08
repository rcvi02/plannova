import { motion } from 'framer-motion'
import { cn } from '@/utils/helpers'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ label, value, icon: Icon, iconColor, trend, trendLabel, subtext, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ delay, duration: 0.22 }}
      className={cn('rounded-2xl p-3 sm:p-4 glass-surface stat-glow flex flex-col justify-between cursor-default relative overflow-hidden', className)}
    >
      {/* Subtle background accent and watermark icon */}
      {iconColor && (
        <div className="absolute top-0 right-0 pointer-events-none -translate-y-2 translate-x-2">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.05]"
            style={{ background: iconColor }}
          />
          {Icon && (
            <div className="absolute top-3 right-3 opacity-[0.07] rotate-[-10deg]">
              <Icon size={64} style={{ color: iconColor }} />
            </div>
          )}
        </div>
      )}

      <div className="flex items-start justify-between mb-3 relative">
        <p className="text-xs font-medium leading-tight" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </p>
        {Icon && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: iconColor ? `${iconColor}20` : 'var(--accent-soft)',
              border: `1px solid ${iconColor ? `${iconColor}30` : 'var(--accent-soft)'}`,
            }}
          >
            <Icon size={16} style={{ color: iconColor || 'var(--accent)' }} />
          </div>
        )}
      </div>

      <div className="relative">
        <div className="flex items-end gap-2">
          <span className="text-lg sm:text-xl font-black leading-none" style={{ color: 'var(--text-primary)' }}>
            {value}
          </span>
          {trend !== undefined && (
            <span className={cn('flex items-center gap-0.5 text-xs font-semibold mb-0.5', trend >= 0 ? 'text-emerald-500' : 'text-rose-500')}>
              {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        {(trendLabel || subtext) && (
          <p className="text-xs mt-1.5 truncate" style={{ color: 'var(--text-muted)' }}>
            {trendLabel || subtext}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export function ChartCard({ title, subtitle, children, action, className }) {
  return (
    <div className={cn('rounded-2xl p-4 sm:p-5 h-full glass-surface stat-glow flex flex-col', className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
