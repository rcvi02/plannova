import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Timer, BarChart3, Calendar, Target, Brain,
  Activity, ArrowRight, Shield, Sparkles, Flame, Gamepad2, Rocket, Trophy
} from 'lucide-react'

const features = [
  { icon: Timer,       title: 'Deep Focus',          desc: 'Immersive pomodoro sessions with ambient audio to keep you in the zone.' },
  { icon: Calendar,    title: 'Visual Planner',      desc: 'Architect your week with precision drag-and-drop scheduling.' },
  { icon: BarChart3,   title: 'Insights',            desc: 'Beautiful, actionable data on your cognitive performance.' },
  { icon: Activity,    title: 'Habit Tracker',       desc: 'Track habits and build unstoppable daily streaks.' },
  { icon: Brain,       title: 'Spaced Recall',       desc: 'Smart algorithms that ensure you never forget what you learn.' },
  { icon: Target,      title: 'Goal Mapping',        desc: 'Break down massive projects into elegant, bite-sized tasks.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent)] selection:text-white">
      
      {/* Premium Aesthetic Light/Dark-Mode Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: 'var(--bg-page)' }}>
        
        {/* Soft, Fluid Mesh Gradient Blobs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.05, 1] }} 
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} 
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full filter blur-[100px] sm:blur-[140px] opacity-[0.4]" 
          style={{ background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)' }}>
        </motion.div>
        
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }} 
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }} 
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full filter blur-[100px] sm:blur-[130px] opacity-[0.3]" 
          style={{ background: 'radial-gradient(circle, var(--accent-2-soft, rgba(255,165,0,0.2)) 0%, transparent 70%)' }}>
        </motion.div>

        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.05, 1] }} 
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1 }} 
          className="absolute top-[20%] left-[40%] w-[50vw] h-[50vw] rounded-full filter blur-[100px] sm:blur-[120px] opacity-[0.25]" 
          style={{ background: 'radial-gradient(circle, var(--success-soft, rgba(0,255,0,0.1)) 0%, transparent 70%)' }}>
        </motion.div>
        
        {/* Very subtle, premium noise/grain texture */}
        <div className="absolute inset-0 opacity-[0.4]" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
        </div>
        
        {/* Dark Mode Tech Grid */}
        <div className="absolute inset-0 hidden dark:block bg-grid-dark pointer-events-none opacity-60"></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-page)] to-[var(--bg-page)] opacity-60"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 w-full bg-[var(--bg-page)]/80 backdrop-blur-md border-b border-[var(--border)]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.jpg" alt="Plannova Logo" className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-[var(--accent-soft)]" />
            <span className="font-black text-3xl font-logo tracking-tight italic" style={{ color: 'var(--text-primary)' }}>
              Plannova
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/login" className="hidden sm:block text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary text-sm shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center pt-20">
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-5 sm:px-6 max-w-5xl mx-auto text-center w-full">
          
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-10 border border-[rgba(255,79,100,0.2)] bg-[var(--accent-soft)] text-[var(--accent)]">
            <Sparkles size={14} /> The new standard in productivity
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] font-black mb-8 tracking-tight text-[var(--text-primary)] leading-[1.05] dark:dark-glow-text" style={{ fontFamily: '"Playfair Display", serif' }}>
            Master your schedule. <br className="hidden sm:block" />
            <span className="italic font-light text-[var(--text-secondary)] dark:text-gray-300">Beautifully.</span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 font-medium leading-relaxed px-4">
            A bright, distraction-free workspace designed for rigorous academic programs. Plan, focus, and execute with absolute precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 px-4">
            <Link to="/register" className="btn btn-primary text-lg px-10 py-4 flex items-center justify-center gap-2 w-full sm:w-auto shadow-xl shadow-[var(--accent-soft)]">
              Create Workspace <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-secondary text-lg px-10 py-4 flex items-center justify-center gap-2 w-full sm:w-auto border border-[var(--border)] hover:bg-[var(--bg-surface-2)]" style={{ background: 'var(--bg-surface)' }}>
              Sign In
            </Link>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 pb-24 sm:pb-32 mt-4 sm:mt-12 relative">
          {/* Ambient center glow for dark mode */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[var(--accent)] filter blur-[150px] opacity-0 dark:opacity-[0.07] pointer-events-none rounded-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            <div className="border border-[var(--border)] rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-[var(--shadow-color,rgba(0,0,0,0.05))] dark:shadow-[0_0_30px_rgba(99,102,241,0.08)] flex flex-col hover:-translate-y-2 hover:border-[var(--accent)] dark:hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] transition-all duration-300" style={{ background: 'var(--bg-surface)' }}>
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mb-6 dark:shadow-[0_0_15px_var(--accent-soft)]">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]" style={{ fontFamily: '"Playfair Display", serif' }}>Absolute Clarity</h3>
              <p className="text-[var(--text-secondary)] dark:text-gray-400 leading-relaxed flex-1 font-medium">
                Stop juggling multiple apps. Plannova brings your tasks, habits, and calendar into one perfectly synchronized environment.
              </p>
            </div>
            
            <div className="border border-[var(--border)] rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-[var(--shadow-color,rgba(0,0,0,0.05))] dark:shadow-[0_0_30px_rgba(56,189,248,0.08)] flex flex-col hover:-translate-y-2 hover:border-[var(--accent-2)] dark:hover:shadow-[0_0_40px_rgba(56,189,248,0.2)] transition-all duration-300" style={{ background: 'var(--bg-surface)' }}>
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-2-soft)] text-[var(--accent-2)] flex items-center justify-center mb-6 dark:shadow-[0_0_15px_var(--accent-2-soft)]">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]" style={{ fontFamily: '"Playfair Display", serif' }}>Distraction Free</h3>
              <p className="text-[var(--text-secondary)] dark:text-gray-400 leading-relaxed flex-1 font-medium">
                An interface designed to get out of your way. No ads, no popups, no clutter. Just you and your most important work.
              </p>
            </div>

            <div className="border border-[var(--border)] rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-[var(--shadow-color,rgba(0,0,0,0.05))] dark:shadow-[0_0_30px_rgba(16,185,129,0.08)] flex flex-col hover:-translate-y-2 hover:border-[var(--success)] dark:hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] transition-all duration-300" style={{ background: 'var(--bg-surface)' }}>
              <div className="w-14 h-14 rounded-2xl bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center mb-6 dark:shadow-[0_0_15px_var(--success-soft)]">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]" style={{ fontFamily: '"Playfair Display", serif' }}>Data Driven</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed flex-1 font-medium">
                Understand your productivity cycles with beautiful analytics. Know exactly when you work best and how to improve.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full border-t border-b border-[var(--border)] py-24 sm:py-32" style={{ background: 'var(--bg-surface)' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-6">
            <div className="mb-16 sm:mb-24 md:w-3/4">
              <h2 className="text-4xl sm:text-5xl font-black mb-6 text-[var(--text-primary)] tracking-tight leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                Engineered for <span className="text-[var(--accent)] italic font-light">excellence.</span>
              </h2>
              <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed font-medium">
                We discarded the clutter and focused entirely on what drives performance. Every feature is designed to keep you in the flow state.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col group cursor-pointer">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center mb-6 shadow-sm dark:shadow-[0_0_15px_var(--accent-soft)] group-hover:bg-[var(--accent)] group-hover:text-white dark:group-hover:shadow-[0_0_25px_var(--accent)] transition-all duration-300">
                    <f.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]" style={{ fontFamily: '"Playfair Display", serif' }}>{f.title}</h3>
                  <p className="text-[var(--text-secondary)] dark:text-gray-400 leading-relaxed text-base sm:text-lg font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gamified Footer & CTA */}
      </main>

      <footer className="w-full relative mt-10 sm:mt-20 border-t border-[var(--border)] bg-[var(--bg-surface-2)] overflow-hidden">
        {/* Playful background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-10 left-[10%] opacity-30 animate-bounce text-[var(--accent)]" style={{ animationDuration: '3s' }}><Sparkles size={40} /></div>
           <div className="absolute bottom-20 right-[15%] opacity-30 animate-pulse text-[var(--accent)]"><Target size={48} /></div>
           <div className="absolute top-32 right-[25%] opacity-30 animate-bounce text-[var(--accent)]" style={{ animationDelay: '1s', animationDuration: '4s' }}><Sparkles size={32} /></div>
           <div className="absolute bottom-10 left-[30%] opacity-30 animate-bounce text-[var(--accent)]" style={{ animationDelay: '2s', animationDuration: '3.5s' }}><Rocket size={40} /></div>
           <div className="absolute top-[40%] left-[5%] opacity-30 animate-pulse text-[var(--accent)]" style={{ animationDelay: '0.5s' }}><Trophy size={36} /></div>
        </div>

        <div className="max-w-4xl mx-auto px-5 py-24 sm:py-32 text-center relative z-10">
          
          {/* Gamified Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-10 border-2 border-[var(--accent)] text-[var(--accent)] shadow-[4px_4px_0_var(--accent)] transform -rotate-2 hover:rotate-0 transition-transform cursor-default" style={{ background: 'var(--bg-surface)' }}>
            <Flame size={18} fill="currentColor" /> Level 99 Productivity
          </div>

          <h2 className="text-5xl sm:text-7xl font-black mb-8 text-[var(--text-primary)] tracking-tight leading-tight dark:dark-glow-text" style={{ fontFamily: '"Playfair Display", serif' }}>
            Ready to <span className="text-[var(--accent)] italic">level up?</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-[var(--text-secondary)] dark:text-gray-300 mb-14 max-w-2xl mx-auto font-bold leading-relaxed">
            Stop playing on hard mode. Join thousands of students turning their academic grind into a winning streak.
          </p>
          
          {/* Arcade Style Button */}
          <Link to="/register" className="group relative inline-flex items-center justify-center px-12 py-5 font-black text-xl tracking-widest text-white bg-[var(--accent)] rounded-2xl overflow-hidden shadow-[0_8px_0_#C81E32] active:shadow-[0_0px_0_#C81E32] active:translate-y-[8px] transition-all duration-100 hover:brightness-110">
             <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-64 group-hover:h-56 opacity-10"></span>
             <span className="relative flex items-center gap-3">
               <Gamepad2 size={26} /> PRESS START
             </span>
          </Link>
        </div>

        {/* Actual Footer Links */}
        <div className="border-t-4 border-[var(--border)] py-8 relative z-10" style={{ background: 'var(--bg-surface)' }}>
          <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
               <img src="/favicon.jpg" alt="Plannova Logo" className="w-8 h-8 rounded-lg object-cover shadow-md" />
              <span className="font-black font-logo italic text-3xl text-[var(--text-primary)] tracking-tight">Plannova</span>
            </div>
            
            <p className="text-sm font-bold text-[var(--text-muted)]">
              &copy; {new Date().getFullYear()} Plannova. Made for high scorers.
            </p>
            
            <div className="flex gap-6 sm:gap-8 justify-center">
              <a href="#" className="text-sm font-black text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors hover:underline decoration-2 underline-offset-4">Patch Notes</a>
              <a href="#" className="text-sm font-black text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors hover:underline decoration-2 underline-offset-4">Privacy Rules</a>
              <a href="#" className="text-sm font-black text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors hover:underline decoration-2 underline-offset-4">Support Guild</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
