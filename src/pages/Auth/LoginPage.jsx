import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Sparkles, Target, Calendar, CheckCircle2, Timer, BarChart3, ArrowRight } from 'lucide-react'
import { loginUser, googleLoginUser } from '@/features/authSlice'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { ButtonLoader } from '@/components/ui/Loader'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.auth)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(loginUser(data))
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success('Welcome back!')
        navigate('/app/dashboard')
      } else {
        toast.error(resultAction.payload || 'Login failed')
      }
    } catch (err) {
      toast.error('An error occurred during login')
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const resultAction = await dispatch(googleLoginUser(credentialResponse.credential))
      if (googleLoginUser.fulfilled.match(resultAction)) {
        toast.success('Google login successful!')
        navigate('/app/dashboard')
      } else {
        toast.error(resultAction.payload || 'Google Login failed')
      }
    } catch (err) {
      toast.error('An error occurred with Google login')
    }
  }

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  }

  return (
    <div className="flex h-[100dvh] w-full bg-[#F8FAFC] overflow-hidden">
      
      {/* Left Side: Interactive Branding */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative overflow-hidden bg-[#FAFAFA]">
        
        {/* Animated Mesh Gradient Background */}
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} 
          className="absolute top-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-[0.4]" 
          style={{ background: 'radial-gradient(circle, #FFE4E6 0%, rgba(255,228,230,0) 70%)' }}>
        </motion.div>
        
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }} 
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }} 
          className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-[0.3]" 
          style={{ background: 'radial-gradient(circle, #FFEDD5 0%, rgba(255,237,213,0) 70%)' }}>
        </motion.div>

        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex items-center gap-3 z-10">
          <img src="/favicon.jpg" alt="Plannova Logo" className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-[var(--accent-soft)]" />
          <span className="text-3xl font-black font-logo tracking-tight drop-shadow-sm italic" style={{ color: 'var(--text-primary)' }}>Plannova</span>
        </motion.div>

        {/* Professional & Interactive UI Showcase Stack */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
          
          <div className="relative w-full max-w-[340px] h-[340px] flex items-center justify-center">
            
            {/* Card 1: Focus Timer (Back Left) */}
            <motion.div 
              initial={{ opacity: 0, x: -50, y: 50, rotate: -10 }}
              animate={{ opacity: 1, x: -40, y: -20, rotate: -5 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.05, zIndex: 30, rotate: 0, x: -30, y: -30 }}
              className="absolute left-0 top-[10%] bg-white/70 backdrop-blur-xl p-5 rounded-3xl shadow-xl border border-white/60 w-[200px] flex flex-col gap-4 z-10 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                  <Timer size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 tracking-tight">Deep Focus</p>
                  <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest">Active</p>
                </div>
              </div>
              <div className="flex items-center justify-center py-2">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-rose-500" strokeWidth="3" strokeDasharray="75, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-sm font-black text-slate-800">45</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Min</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Analytics (Back Right) */}
            <motion.div 
              initial={{ opacity: 0, x: 50, y: -50, rotate: 10 }}
              animate={{ opacity: 1, x: 40, y: -10, rotate: 5 }}
              transition={{ duration: 1, type: "spring", stiffness: 100, delay: 0.1 }}
              whileHover={{ scale: 1.05, zIndex: 30, rotate: 0, x: 30, y: -20 }}
              className="absolute right-0 top-[20%] bg-white/70 backdrop-blur-xl p-5 rounded-3xl shadow-xl border border-white/60 w-[200px] flex flex-col gap-4 z-10 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100">
                  <BarChart3 size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 tracking-tight">Productivity</p>
                  <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1">+12% <ArrowRight size={10} className="-rotate-45" /></p>
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-16 mt-2">
                <motion.div initial={{ height: 0 }} animate={{ height: '40%' }} className="flex-1 bg-indigo-100 rounded-t-md"></motion.div>
                <motion.div initial={{ height: 0 }} animate={{ height: '70%' }} className="flex-1 bg-indigo-200 rounded-t-md"></motion.div>
                <motion.div initial={{ height: 0 }} animate={{ height: '50%' }} className="flex-1 bg-indigo-300 rounded-t-md"></motion.div>
                <motion.div initial={{ height: 0 }} animate={{ height: '90%' }} className="flex-1 bg-indigo-500 rounded-t-md shadow-sm"></motion.div>
                <motion.div initial={{ height: 0 }} animate={{ height: '60%' }} className="flex-1 bg-indigo-100 rounded-t-md"></motion.div>
              </div>
            </motion.div>

            {/* Card 3: Schedule (Front Center) */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 60, rotate: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: 40 }}
              className="absolute bg-white/80 backdrop-blur-2xl p-5 rounded-3xl shadow-2xl border border-white/80 w-[240px] flex flex-col gap-4 z-20 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shadow-sm border border-[rgba(255,79,100,0.1)]">
                    <Calendar size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 tracking-tight">Today's Plan</p>
                    <p className="text-xs font-medium text-slate-500">4 Tasks remaining</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100 flex items-center justify-center">
                   <Target size={14} className="text-slate-400" />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-1">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                  <div className="w-4 h-4 rounded-full border-2 border-blue-200 flex items-center justify-center group-hover:border-blue-500 transition-colors"></div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-800">Advanced Calculus</p>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">10:00 AM</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] rounded-l-xl"></div>
                  <div className="w-4 h-4 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-sm">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 line-through">Physics Lab Report</p>
                    <p className="text-[9px] font-semibold text-[var(--accent)] uppercase tracking-wider">Completed</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom Text */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative z-10 mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Elevate your <br/>
            <span className="gradient-text">academic game.</span>
          </h1>
          <p className="text-base font-medium leading-relaxed max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            Join the elite community of students managing their time beautifully and effortlessly.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col px-4 sm:px-8 py-8 lg:py-2 relative overflow-y-auto bg-slate-50 lg:bg-white">
        
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full max-w-[380px] m-auto z-10 bg-white lg:bg-transparent p-6 sm:p-8 lg:p-0 rounded-3xl shadow-xl shadow-slate-200/40 lg:shadow-none border border-slate-100 lg:border-none">
          
          <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <img src="/favicon.jpg" alt="Plannova Logo" className="h-8 w-8 rounded-xl object-cover shadow-sm" />
            <span className="text-xl font-bold font-logo tracking-tight" style={{ color: 'var(--text-primary)' }}>Plannova</span>
          </div>

          <motion.div variants={fadeInUp} className="mb-6 lg:mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>Welcome back</h2>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Log in to your account to continue.</p>
          </motion.div>

          {/* Social Logins */}
          <motion.div variants={fadeInUp} className="mb-6">
            <div className="hover:scale-[1.01] transition-transform">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Login Failed')}
                theme="outline"
                size="large"
                shape="rectangular"
                text="signin_with"
                width="100%"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
            <div className="h-[1px] flex-1 bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">Or email</span>
            <div className="h-[1px] flex-1 bg-slate-200"></div>
          </motion.div>

          <motion.form variants={fadeInUp} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@university.edu"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all outline-none text-[var(--text-primary)] bg-slate-50 hover:bg-slate-100/50 focus:bg-white placeholder:text-slate-400"
              />
              {errors.email && <p className="text-xs text-rose-500 font-medium mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity">Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-11 py-3 text-sm rounded-xl border border-slate-200 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all outline-none text-[var(--text-primary)] bg-slate-50 hover:bg-slate-100/50 focus:bg-white placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 font-medium mt-1">{errors.password.message}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 mt-2 rounded-xl text-sm font-bold flex justify-center items-center gap-2 shadow-lg shadow-[var(--accent-soft)]"
            >
              {loading ? <ButtonLoader color="#ffffff" /> : 'Log in'}
            </motion.button>
          </motion.form>

          <motion.div variants={fadeInUp} className="mt-8 text-center">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Don't have an account? </span>
            <Link to="/register" className="text-sm font-bold text-[var(--accent)] hover:opacity-80 transition-opacity">
              Sign up
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
