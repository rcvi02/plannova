import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { cn } from '@/utils/helpers'

// Minimal bouncing dot loader for buttons
export function ButtonLoader({ size = 24, color = 'currentColor', className }) {
  return (
    <div className={cn("flex gap-1 items-center justify-center", className)} style={{ width: size }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// Gorgeous glowing modern loader for full pages
export function ThemeLoader() {
  const letters = "Plannova".split("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  // Set initial mouse position to center on mount
  useEffect(() => {
    setMousePosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  }, [])

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="flex flex-col items-center justify-center h-screen bg-[var(--bg-page)] relative overflow-hidden selection:bg-transparent cursor-crosshair"
    >
      {/* Interactive Cursor Spotlight - Follows Mouse! */}
      <motion.div 
        animate={{ x: mousePosition.x - 400, y: mousePosition.y - 400 }}
        transition={{ type: "spring", damping: 30, stiffness: 100, mass: 0.8 }}
        className="absolute top-0 left-0 w-[150vw] h-[150vw] sm:w-[800px] sm:h-[800px] rounded-full pointer-events-none opacity-40 mix-blend-screen"
        style={{ background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)' }}
      />
      
      {/* Abstract Floating Background Rings */}
      <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] border-[1px] border-[var(--accent)]/10 rounded-full" />
      <motion.div animate={{ rotate: -360, scale: [1, 1.2, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] border-[1px] border-orange-400/10 rounded-full" />
      <motion.div animate={{ rotate: 180, scale: [1, 1.3, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[20%] right-[10%] w-[20vw] h-[20vw] border-[1px] border-blue-400/10 rounded-full" />

      <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-12">
        
        {/* Ultra-Attractive Animated & Interactive Text */}
        <div className="flex items-center">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 60, rotateX: 90, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              whileHover={{ 
                y: -25, 
                scale: 1.15,
                color: 'var(--accent)',
                textShadow: '0px 15px 30px rgba(255,79,100,0.5)',
                rotateZ: Math.random() > 0.5 ? 5 : -5,
                transition: { type: 'spring', stiffness: 300, damping: 12 }
              }}
              transition={{
                duration: 1.2,
                delay: index * 0.1,
                type: "spring",
                bounce: 0.5
              }}
              className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-logo tracking-tight italic inline-block drop-shadow-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Elegant Gradient Progress Line - variable speed */}
        <div className="w-56 sm:w-72 h-[4px] bg-[var(--bg-surface-3)] rounded-full overflow-hidden relative shadow-inner mt-2 sm:mt-4">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-orange-400 via-[var(--accent)] to-rose-500 rounded-full shadow-[0_0_10px_rgba(255,79,100,0.5)]"
          />
        </div>
        
        {/* Tech-inspired Subtitle */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-ping shadow-[0_0_10px_var(--accent)]"></div>
          <p className="text-[11px] font-black tracking-[0.5em] uppercase text-slate-500">
            Initializing
          </p>
        </motion.div>
      </div>
    </div>
  )
}
