import { cn } from '@/utils/helpers'
import { Zap } from 'lucide-react'

export function Skeleton({ className, style }) {
  return <div className={cn('skeleton', className)} style={style} />
}

export function CardSkeleton({ className }) {
  return (
    <div
      className={cn('rounded-2xl p-5', className)}
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="w-9 h-9 rounded-xl" />
      </div>
      <Skeleton className="h-7 w-16 rounded-lg mb-2" />
      <Skeleton className="h-3 w-32 rounded-lg" />
    </div>
  )
}

export function TaskSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <Skeleton className="w-5 h-5 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 rounded-lg mb-2" />
        <Skeleton className="h-3 w-1/2 rounded-lg" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--text-primary)' }}>
          <Zap size={20} style={{ color: 'var(--bg-page)' }} className="animate-pulse" />
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--accent)',
                animation: `pulseSubtle 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PageLoader
