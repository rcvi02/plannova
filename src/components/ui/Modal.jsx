import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/helpers'

export default function Modal({ isOpen, onClose, title, children, size = 'md', className }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-5xl' }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose?.() }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn('w-full rounded-2xl overflow-hidden', sizes[size], className)}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function Drawer({ isOpen, onClose, title, children, side = 'right' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const slideVariants = {
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
    bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
  }

  const sv = slideVariants[side]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={sv.initial}
            animate={sv.animate}
            exit={sv.exit}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'fixed z-50 flex flex-col',
              side === 'right' && 'top-0 right-0 h-full w-full max-w-md',
              side === 'left' && 'top-0 left-0 h-full w-full max-w-md',
              side === 'bottom' && 'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl',
            )}
            style={{ background: 'var(--bg-surface)', borderLeft: side === 'right' ? '1px solid var(--border)' : 'none', boxShadow: 'var(--shadow-xl)' }}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
                <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }} aria-label="Close">
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
