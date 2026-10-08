import { forwardRef } from 'react'
import { cn } from '@/utils/helpers'

const Input = forwardRef(function Input({ label, error, icon: Icon, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
            <Icon size={15} />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2.5 text-sm rounded-xl input-focus',
            Icon && 'pl-9',
            className
          )}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
          {...props}
        />
      </div>
      {error && <p className="text-xs" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  )
})

export default Input

export const Textarea = forwardRef(function Textarea({ label, error, className, rows = 4, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn('w-full px-3 py-2.5 text-sm rounded-xl input-focus resize-none', className)}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          outline: 'none',
        }}
        {...props}
      />
      {error && <p className="text-xs" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  )
})

export const Select = forwardRef(function Select({ label, error, className, options = [], placeholder, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn('w-full px-3 py-2.5 text-sm rounded-xl input-focus cursor-pointer', className)}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          outline: 'none',
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  )
})
