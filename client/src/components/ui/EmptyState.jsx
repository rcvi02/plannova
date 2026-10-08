import { cn } from '@/utils/helpers'
import IconRenderer from '@/components/ui/IconRenderer'

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-6 text-center relative overflow-hidden', className)}>
      {/* Glowing ambient background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[var(--accent)] rounded-full mix-blend-screen filter blur-[60px] opacity-10 pointer-events-none"></div>

      {Icon && (
        <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform hover:scale-105 duration-300 shadow-lg" 
             style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
          <Icon size={28} strokeWidth={1.5} />
        </div>
      )}
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-1.5 tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        {description && <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm" style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)' }}>
        <IconRenderer name="AlertTriangle" size={24} style={{ color: 'var(--danger)' }} />
      </div>
      <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {description && <p className="text-sm max-w-xs mb-4" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      {onRetry && (
        <button className="btn btn-secondary text-sm" onClick={onRetry}>Try again</button>
      )}
    </div>
  )
}
