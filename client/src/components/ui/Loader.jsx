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

// Gorgeous glowing modern loader with complete animated SVG pattern drawing
export function ThemeLoader({ onComplete }) {
  const letters = "Plannova".split("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [progress, setProgress] = useState(0)

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  // Set initial mouse position to center on mount
  useEffect(() => {
    setMousePosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  }, [])

  // Smooth progress counter from 0 to 100%
  useEffect(() => {
    const startTime = Date.now()
    const duration = 2200 // 2.2 seconds for full pattern draw

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const current = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(current)

      if (current >= 100) {
        clearInterval(interval)
        if (onComplete) onComplete()
      }
    }, 25)

    return () => clearInterval(interval)
  }, [onComplete])

  const getStatusText = (p) => {
    if (p < 30) return "Drawing workspace pattern..."
    if (p < 65) return "Synchronizing syllabus & schedule..."
    if (p < 95) return "Configuring focus sessions..."
    return "Ready to excel!"
  }

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.5, ease: 'easeInOut' } }}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-page)] relative overflow-hidden selection:bg-transparent cursor-crosshair min-h-screen w-full"
    >
      {/* Interactive Cursor Spotlight - Follows Mouse */}
      <motion.div 
        animate={{ x: mousePosition.x - 400, y: mousePosition.y - 400 }}
        transition={{ type: "spring", damping: 30, stiffness: 100, mass: 0.8 }}
        className="absolute top-0 left-0 w-[150vw] h-[150vw] sm:w-[800px] sm:h-[800px] rounded-full pointer-events-none opacity-40 mix-blend-screen"
        style={{ background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)' }}
      />
      
      {/* Abstract Floating Ambient Background Rings */}
      <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] border-[1px] border-[var(--accent)]/10 rounded-full pointer-events-none" />
      <motion.div animate={{ rotate: -360, scale: [1, 1.2, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] border-[1px] border-orange-400/10 rounded-full pointer-events-none" />
      <motion.div animate={{ rotate: 180, scale: [1, 1.3, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[20%] right-[10%] w-[20vw] h-[20vw] border-[1px] border-purple-400/10 rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 px-4 text-center">
        
        {/* CENTERPIECE: Complete Geometric Pattern Drawing */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--accent)]/20 via-orange-500/20 to-purple-500/20 blur-2xl animate-pulse" />

          <svg 
            viewBox="0 0 200 200" 
            className="w-full h-full relative z-10 overflow-visible drop-shadow-[0_0_15px_rgba(255,79,100,0.35)]"
          >
            <defs>
              <linearGradient id="patternGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4F64" />
                <stop offset="50%" stopColor="#FFA048" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="patternGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#FF4F64" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. Outer Orbiting Dashed Ring */}
            <motion.circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="var(--border)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: 'center' }}
            />

            {/* 2. Main Outer Path Draw */}
            <motion.circle
              cx="100"
              cy="100"
              r="76"
              fill="none"
              stroke="url(#patternGrad1)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: 270 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              style={{ transformOrigin: 'center' }}
            />

            {/* 3. Concentric Diamond Shape 1 */}
            <motion.polygon
              points="100,30 170,100 100,170 30,100"
              fill="none"
              stroke="url(#patternGrad2)"
              strokeWidth="2"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, rotate: 360 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              style={{ transformOrigin: 'center' }}
            />

            {/* 4. Counter-rotating Diamond Shape 2 */}
            <motion.polygon
              points="100,45 155,100 100,155 45,100"
              fill="none"
              stroke="url(#patternGrad1)"
              strokeWidth="1.75"
              strokeLinejoin="round"
              strokeDasharray="6 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9, rotate: -360 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              style={{ transformOrigin: 'center' }}
            />

            {/* 5. Intricate Inner Star Compass */}
            <motion.path
              d="M100 55 L112 88 L145 100 L112 112 L100 145 L88 112 L55 100 L88 88 Z"
              fill="rgba(255, 79, 100, 0.08)"
              stroke="url(#patternGrad1)"
              strokeWidth="2"
              strokeLinejoin="round"
              initial={{ pathLength: 0, scale: 0.5, opacity: 0 }}
              animate={{ pathLength: 1, scale: 1, opacity: 1 }}
              transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
              style={{ transformOrigin: 'center' }}
            />

            {/* 6. Glowing Inner Nucleus Circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="14"
              fill="url(#patternGrad1)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 1.2, delay: 0.5, ease: "backOut" }}
              style={{ transformOrigin: 'center' }}
            />

            {/* Core Pulse Ripple */}
            <motion.circle
              cx="100"
              cy="100"
              r="22"
              fill="none"
              stroke="#FFA048"
              strokeWidth="1.5"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: 'center' }}
            />

            {/* Central Pin Dot */}
            <circle cx="100" cy="100" r="4" fill="#ffffff" />
          </svg>

          {/* Dynamic Percentage in Center Badge */}
          <div className="absolute -bottom-3 bg-[var(--bg-surface-2)]/90 backdrop-blur-md border border-[var(--border)] px-3 py-0.5 rounded-full shadow-lg">
            <span className="text-xs font-bold font-mono text-[var(--accent)] tracking-wider">
              {progress}%
            </span>
          </div>
        </div>

        {/* Brand Name: Plannova Springing in with Pattern */}
        <div className="flex items-center justify-center mt-2">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 35, rotateX: 90, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              whileHover={{ 
                y: -15, 
                scale: 1.15,
                color: 'var(--accent)',
                transition: { type: 'spring', stiffness: 300, damping: 12 }
              }}
              transition={{
                duration: 0.8,
                delay: 0.15 + index * 0.08,
                type: "spring",
                bounce: 0.4
              }}
              className="text-4xl sm:text-6xl md:text-7xl font-black font-logo tracking-tight italic inline-block drop-shadow-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Elegant Gradient Progress Bar Synchronized with 0-100% */}
        <div className="w-64 sm:w-80 h-[5px] bg-[var(--bg-surface-3)] rounded-full overflow-hidden relative shadow-inner mt-1">
          <motion.div 
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-orange-400 via-[var(--accent)] to-rose-500 rounded-full shadow-[0_0_12px_rgba(255,79,100,0.6)] transition-all duration-75 ease-out"
          />
        </div>
        
        {/* Dynamic Status Text */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2.5 mt-1"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping shadow-[0_0_8px_var(--accent)]" />
          <p className="text-xs font-semibold tracking-wider text-[var(--text-secondary)]">
            {getStatusText(progress)}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
