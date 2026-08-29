import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, CheckCircle2, BarChart3, Timer, BookOpen, Target,
  ArrowRight, Star, Play, Calendar, Activity, Brain,
  TrendingUp, RefreshCw, ListTodo, GraduationCap
} from 'lucide-react'

const features = [
  { icon: Timer,       title: 'Pomodoro Focus Timer',   desc: 'Stay laser-focused with a beautiful circular timer and ambient sessions.',           color: '#7C3AED', soft: '#EDE9FE' },
  { icon: BarChart3,   title: 'Smart Analytics',        desc: 'Visualize your study patterns, habits, and progress with stunning charts.',          color: '#0EA5E9', soft: '#E0F2FE' },
  { icon: Calendar,    title: 'Study Planner',          desc: 'Plan your week with an interactive calendar and drag-and-drop scheduling.',           color: '#059669', soft: '#D1FAE5' },
  { icon: Target,      title: 'Goal Tracking',          desc: 'Set and monitor daily, weekly, monthly goals with milestone celebrations.',           color: '#D97706', soft: '#FEF3C7' },
  { icon: Brain,       title: 'Spaced Repetition',      desc: 'Smart revision scheduling using proven memory retention algorithms.',                  color: '#DC2626', soft: '#FEE2E2' },
  { icon: Activity,    title: 'Habit Streaks',          desc: 'Build consistent study habits with a beautiful heatmap and streak tracker.',          color: '#8B5CF6', soft: '#EDE9FE' },
  { icon: ListTodo,    title: 'Task Management',        desc: 'Organize your to-dos with priority tags, Kanban boards, and smart filters.',          color: '#0EA5E9', soft: '#E0F2FE' },
  { icon: GraduationCap, title: 'Exam Countdown',      desc: 'Track upcoming exams with preparation progress and countdown timers.',                 color: '#F43F5E', soft: '#FFE4E6' },
  { icon: BookOpen,    title: 'Rich Notes',             desc: 'Take rich-text notes with full formatting, pinning, and subject organization.',       color: '#10B981', soft: '#D1FAE5' },
]

const steps = [
  { n: '01', title: 'Add Your Subjects', desc: 'Set up your subjects, chapters, and study goals in minutes.' },
  { n: '02', title: 'Plan Your Schedule', desc: 'Use the planner to schedule focused study sessions each day.' },
  { n: '03', title: 'Track & Analyze',    desc: 'Watch your progress soar with beautiful analytics and streaks.' },
]

const testimonials = [
  { name: 'Priya S.',  role: 'Medical Student',     text: 'StudyFlow transformed how I prepare for exams. The Pomodoro timer + revision tracker is a game-changer!', rating: 5 },
  { name: 'Arjun K.',  role: 'Engineering Student', text: "The analytics dashboard showed me exactly when I study best. I've increased my productivity by 40%.", rating: 5 },
  { name: 'Meera R.',  role: 'CA Aspirant',         text: 'Nothing compares to this for exam prep. The subject tracking and goal system keeps me on track every day.', rating: 5 },
]

const stats = [
  { value: '50K+', label: 'Students' },
  { value: '2M+',  label: 'Sessions' },
  { value: '98%',  label: 'Satisfaction' },
  { value: '4.9★', label: 'Rating' },
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {/* ─── Sticky Nav ─── */}
      <nav
        className="sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between max-w-7xl mx-auto"
        style={{
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          background: 'rgba(var(--bg-page-rgb, 244,242,238), 0.85)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'var(--text-primary)' }}>
            <Zap size={15} style={{ color: 'var(--bg-page)' }} />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>StudyFlow</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--text-secondary)' }}>Sign In</Link>
          <Link to="/app/dashboard" className="btn btn-primary text-sm px-4 py-2">Get Started Free</Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-24 max-w-5xl mx-auto text-center overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full mix-blend-screen opacity-20 pointer-events-none" 
          style={{ background: 'radial-gradient(ellipse at center, #0EA5E9 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full mix-blend-screen opacity-20 pointer-events-none" 
          style={{ background: 'radial-gradient(ellipse at center, #38BDF8 0%, transparent 70%)', filter: 'blur(50px)' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-sm mb-6 inline-flex items-center gap-2" 
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid #0EA5E930' }}>
            <Zap size={11} /> ✨ StudyFlow 2.0 is here · Completely Free
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Study smarter.<br />
            <span className="gradient-text">Focus deeper.</span><br />
            Achieve more.
          </h1>

          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            StudyFlow is the premium study planner built for ambitious students. Track subjects, schedule sessions, manage exams, and build unstoppable habits — all in one beautiful workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/app/dashboard"
              className="btn btn-primary text-base px-8 py-3.5 rounded-2xl flex items-center gap-2 w-full sm:w-auto justify-center"
              style={{ boxShadow: '0 8px 30px rgba(124,58,237,0.35)' }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/app/dashboard"
              className="btn btn-secondary text-base px-8 py-3.5 rounded-2xl flex items-center gap-2 w-full sm:w-auto justify-center">
              <Play size={14} fill="currentColor" style={{ color: 'var(--accent)' }} /> View Demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6">
            {['No credit card needed', '100% Free', 'Works offline'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                <CheckCircle2 size={13} style={{ color: 'var(--success)' }} /> {t}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-14 relative"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 40px 100px rgba(0,0,0,0.15)' }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border)' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-4 px-3 py-1.5 rounded-lg text-xs text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                studyflow.app/dashboard
              </div>
            </div>
            {/* Preview content */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Today's Study", value: '4h 20m', color: '#7C3AED' },
                  { label: 'Streak',        value: '7 days',  color: '#F59E0B' },
                  { label: 'Completed',     value: '8 tasks', color: '#059669' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-2xl p-3 sm:p-4"
                    style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl p-4 h-24 sm:h-28" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Weekly Progress</p>
                  <div className="flex items-end gap-1 h-14">
                    {[40,70,55,85,60,90,45].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? 'var(--accent)' : 'var(--bg-surface-3)' }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl p-4" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Subject Progress</p>
                  <div className="space-y-2">
                    {[
                      { name: 'Math',      pct: 75, color: '#7C3AED' },
                      { name: 'Physics',   pct: 60, color: '#0EA5E9' },
                      { name: 'Chemistry', pct: 45, color: '#059669' },
                    ].map(s => (
                      <div key={s.name}>
                        <div className="flex justify-between text-[10px] mb-0.5" style={{ color: 'var(--text-muted)' }}>
                          <span>{s.name}</span><span>{s.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-surface-3)' }}>
                          <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Stats Banner ─── */}
      <section className="px-4 sm:px-6 py-10" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="text-2xl sm:text-3xl font-black gradient-text">{s.value}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Everything you need to excel
          </h2>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            A complete study ecosystem designed for maximum focus and results.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-5 sm:p-6 card-hover"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: f.soft }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="px-4 sm:px-6 py-16 sm:py-24" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Up and running in 3 steps
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>No complex setup. Just open and start studying.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-black"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '2px solid var(--accent-soft)' }}>
                  {step.n}
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Loved by ambitious students
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={13} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--text-primary)', color: 'var(--bg-page)' }}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center rounded-3xl p-10 sm:p-14 relative overflow-hidden"
          style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
          {/* Decorative */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'var(--accent)' }} />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'var(--accent-2)' }} />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
              style={{ background: 'var(--text-primary)' }}>
              <Zap size={24} style={{ color: 'var(--bg-page)' }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Start your study journey today
            </h2>
            <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
              Join thousands of students who study smarter with StudyFlow.
            </p>
            <Link to="/app/dashboard"
              className="btn btn-primary text-base px-8 py-4 rounded-2xl inline-flex items-center gap-2"
              style={{ boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}>
              Start for Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-4 sm:px-6 py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--text-primary)' }}>
              <Zap size={12} style={{ color: 'var(--bg-page)' }} />
            </div>
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>StudyFlow</span>
          </div>
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            © 2026 StudyFlow. Built for student success. 🎓
          </p>
          <div className="flex gap-4">
            {['Privacy', 'Terms', 'Support'].map(link => (
              <span key={link} className="text-xs cursor-pointer" style={{ color: 'var(--text-muted)' }}>{link}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
