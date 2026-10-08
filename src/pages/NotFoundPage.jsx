import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Gamepad2 } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden text-slate-200 font-sans">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        {/* Retro Game Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]"></div>
        
        {/* Cursor Glow spotlight */}
        <motion.div 
          animate={{ x: mousePosition.x - 300, y: mousePosition.y - 300 }}
          transition={{ type: "spring", damping: 30, stiffness: 50, mass: 1 }}
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/10 blur-[100px] pointer-events-none"
        />
        
        {/* Ambient background glows */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.6 }}
        >
          <Gamepad2 size={64} className="text-[var(--accent)] mb-6 mx-auto opacity-90 drop-shadow-[0_0_15px_rgba(255,79,100,0.5)]" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: 'spring' }}
          className="text-7xl sm:text-8xl md:text-[10rem] font-black tracking-tighter mb-2 leading-none"
          style={{ 
            background: 'linear-gradient(to right, #ff4f64, #a855f7, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 10px 40px rgba(255,79,100,0.3)'
          }}
        >
          404
        </motion.h1>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight"
        >
          Glitch in the System
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-400 mb-10 max-w-md mx-auto text-sm sm:text-base md:text-lg leading-relaxed"
        >
          Oops! It looks like you've wandered into an uncharted zone. The page you are looking for has vanished or never existed.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center"
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md text-slate-200 font-semibold transition-all border border-slate-700 hover:border-slate-600 w-full sm:w-auto justify-center group shadow-lg"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <Link 
            to="/"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold transition-all shadow-[0_0_20px_var(--accent-soft)] hover:shadow-[0_0_30px_rgba(255,79,100,0.6)] w-full sm:w-auto justify-center group"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            Return Home
          </Link>
        </motion.div>
      </div>

    </div>
  )
}