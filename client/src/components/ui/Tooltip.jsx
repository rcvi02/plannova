import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Tooltip({ children, content, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div 
      className="relative group w-full h-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 whitespace-nowrap px-3 py-1.5 text-xs rounded-lg shadow-xl pointer-events-none ${positions[position]}`}
            style={{ background: 'var(--bg-surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
