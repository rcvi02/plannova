import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, BookOpen } from 'lucide-react'
import { registerUser, googleLoginUser } from '@/features/authSlice'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'

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
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      
      {/* Left Side: Branding / Marketing (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B1120 0%, #0F172A 100%)' }}>
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0EA5E9] rounded-full mix-blend-screen filter blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#38BDF8] rounded-full mix-blend-screen filter blur-[100px] opacity-10 translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white shadow-lg shadow-[#0EA5E9]/30">
            <BookOpen size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">StudyFlow</span>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-6">
            Join thousands of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9]">top performers.</span>
          </h1>
          <p className="text-[#94A3B8] text-lg font-medium leading-relaxed max-w-md">
            Create an account to unlock premium planning, focus timers, and intelligent analytics.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 bg-white relative">
        <div className="mx-auto w-full max-w-[420px]">
          
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white shadow-md">
              <BookOpen size={20} />
            </div>
            <span className="text-2xl font-bold text-[#0F172A] tracking-tight">StudyFlow</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">Create an account</h2>
            <p className="text-[#64748B]">Join StudyFlow and supercharge your studies.</p>
          </div>

          {/* Social Logins */}
          <div className="mt-8 mb-8">
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

          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-[#E2E8F0]"></div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Or register with email</span>
            <div className="h-[1px] flex-1 bg-[#E2E8F0]"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1E293B]">Full Name</label>
              <input
                {...register('name')}
                type="text"
                placeholder="Alex Chen"
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#0EA5E9]/10 transition-all outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
              />
              {errors.name && <p className="text-xs text-[#EF4444] font-medium mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1E293B]">Email address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@university.edu"
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#0EA5E9]/10 transition-all outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
              />
              {errors.email && <p className="text-xs text-[#EF4444] font-medium mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1E293B]">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8+ chars"
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#0EA5E9]/10 transition-all outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-[#EF4444] font-medium mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1E293B]">Confirm</label>
                <div className="relative">
                  <input
                    {...register('confirm')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat"
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#0EA5E9]/10 transition-all outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
                  />
                </div>
                {errors.confirm && <p className="text-xs text-[#EF4444] font-medium mt-1">{errors.confirm.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 rounded-xl text-white font-semibold shadow-lg shadow-[#0EA5E9]/25 hover:shadow-[#0EA5E9]/40 hover:-translate-y-[1px] transition-all flex justify-center items-center gap-2 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7]"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-8 text-[#64748B] font-medium">
            Already have an account? <Link to="/login" className="text-[#0EA5E9] hover:text-[#0284C7] font-semibold transition-colors">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  )
}
