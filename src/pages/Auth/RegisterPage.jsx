import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, BookOpen } from 'lucide-react'
import { registerUser, googleLoginUser } from '@/features/authSlice'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { ButtonLoader } from '@/components/ui/Loader'

const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const fadeInUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } } }

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] })

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.auth)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(registerUser(data))
      if (registerUser.fulfilled.match(resultAction)) {
        sessionStorage.setItem('plannova-new-user', 'true')
        toast.success('Account created!')
        navigate('/app/dashboard')
      } else {
        toast.error(resultAction.payload || 'Registration failed')
      }
    } catch (err) {
      toast.error('An error occurred during registration')
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const resultAction = await dispatch(googleLoginUser(credentialResponse.credential))
      if (googleLoginUser.fulfilled.match(resultAction)) {
        sessionStorage.setItem('plannova-new-user', 'true')
        toast.success('Google login successful!')
        navigate('/app/dashboard')
      } else {
        toast.error(resultAction.payload || 'Google Login failed')
      }
    } catch (err) {
      toast.error('An error occurred with Google login')
    }
  }

  return (
    <div className="flex h-[100dvh] w-full bg-[#F8FAFC] overflow-hidden">
      
      {/* Left Side: Branding / Marketing (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative overflow-hidden" style={{ background: 'var(--bg-page)' }}>
        {/* Subtle patterned background or shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/3" style={{ background: 'var(--accent-2)' }}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 translate-y-1/3 -translate-x-1/4" style={{ background: 'var(--accent)' }}></div>

        <div className="flex items-center gap-2 z-10">
          <img src="/favicon.jpg" alt="Plannova Logo" className="h-10 w-10 rounded-xl object-cover shadow-md" />
          <span className="text-2xl font-black font-logo tracking-tight drop-shadow-sm italic" style={{ color: 'var(--text-primary)' }}>Plannova</span>
        </div>

        <div className="relative z-10 mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Start your journey to <br/>
            <span className="gradient-text">academic excellence.</span>
          </h1>
          <p className="text-lg font-medium leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of ambitious students mastering their time and achieving their goals with Plannova.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col px-4 sm:px-8 py-8 lg:py-2 relative overflow-y-auto bg-slate-50 lg:bg-white">
        
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full max-w-[420px] m-auto z-10 bg-white lg:bg-transparent p-6 sm:p-8 lg:p-0 rounded-3xl shadow-xl shadow-slate-200/40 lg:shadow-none border border-slate-100 lg:border-none">
          
          <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <img src="/favicon.jpg" alt="Plannova Logo" className="h-8 w-8 rounded-xl object-cover shadow-sm" />
            <span className="text-xl font-bold font-logo tracking-tight" style={{ color: 'var(--text-primary)' }}>Plannova</span>
          </div>

          <motion.div variants={fadeInUp} className="mb-6 lg:mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>Create an account</h2>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Sign up in seconds to get started.</p>
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
                text="signup_with"
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
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input
                {...register('name')}
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all outline-none text-[var(--text-primary)] bg-slate-50 hover:bg-slate-100/50 focus:bg-white placeholder:text-slate-400"
              />
              {errors.name && <p className="text-xs text-rose-500 font-medium mt-1">{errors.name.message}</p>}
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
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

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Confirm</label>
                <div className="relative">
                  <input
                    {...register('confirm')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all outline-none text-[var(--text-primary)] bg-slate-50 hover:bg-slate-100/50 focus:bg-white placeholder:text-slate-400"
                  />
                </div>
                {errors.confirm && <p className="text-xs text-rose-500 font-medium mt-1">{errors.confirm.message}</p>}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 mt-2 rounded-xl text-sm font-bold flex justify-center items-center gap-2 shadow-lg shadow-[var(--accent-soft)]"
            >
              {loading ? <ButtonLoader color="#ffffff" /> : 'Create account'}
            </motion.button>
          </motion.form>

          <motion.div variants={fadeInUp} className="mt-8 text-center">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Already have an account? </span>
            <Link to="/login" className="text-sm font-bold text-[var(--accent)] hover:opacity-80 transition-opacity">
              Sign in
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
