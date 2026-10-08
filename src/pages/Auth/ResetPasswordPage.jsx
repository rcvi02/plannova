import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, KeyRound } from 'lucide-react'
import { ButtonLoader } from '@/components/ui/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword, clearError } from '@/features/authSlice'
import { toast } from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { loading } = useSelector(state => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (otp && password) {
      const resultAction = await dispatch(resetPassword({ otp, password }))
      if (resetPassword.fulfilled.match(resultAction)) {
        toast.success('Password reset successful! Welcome back.')
        navigate('/dashboard')
      } else {
        toast.error(resultAction.payload || 'Failed to reset password')
      }
    }
  }

  return (
    <div className="fixed inset-0 w-screen h-screen flex bg-[var(--bg-page)] overflow-hidden">
      
      {/* Left Side: Branding / Marketing (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative overflow-hidden" style={{ background: 'var(--bg-page)' }}>
        {/* Subtle patterned background or shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/3" style={{ background: 'var(--accent-2)' }}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 translate-y-1/3 -translate-x-1/4" style={{ background: 'var(--accent)' }}></div>

        <div className="flex items-center gap-2 z-10">
          <img src="/favicon.jpg" alt="Plannova Logo" className="h-10 w-10 rounded-xl object-cover shadow-md" />
          <span className="text-2xl font-black font-logo tracking-tight drop-shadow-sm italic" style={{ color: 'var(--text-primary)' }}>Plannova</span>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Welcome back to <br/>
            <span className="gradient-text">excellence.</span>
          </h1>
          <p className="text-lg font-medium leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
            Set a new password for your Plannova account and continue your productivity streak.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-2 lg:px-16 relative" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto w-full max-w-[420px] flex flex-col justify-center h-full">
          
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6">
            <ArrowLeft size={16} /> Back to login
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-2">Create New Password</h2>
            <p className="text-[var(--text-secondary)]">Enter the 6-digit OTP code sent to your email and choose a new password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <KeyRound size={16} className="text-[var(--text-muted)]" /> OTP Code
              </label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                placeholder="123456"
                className="w-full px-4 py-3 text-sm rounded-xl border border-[var(--border)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all outline-none text-[var(--text-primary)] bg-[var(--bg-page)] placeholder:text-[var(--text-muted)] font-mono tracking-widest uppercase"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Lock size={16} className="text-[var(--text-muted)]" /> New Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm rounded-xl border border-[var(--border)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all outline-none text-[var(--text-primary)] bg-[var(--bg-page)] placeholder:text-[var(--text-muted)]"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Lock size={16} className="text-[var(--text-muted)]" /> Confirm Password
              </label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm rounded-xl border border-[var(--border)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all outline-none text-[var(--text-primary)] bg-[var(--bg-page)] placeholder:text-[var(--text-muted)]"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 mt-4 rounded-xl text-sm font-semibold flex justify-center items-center gap-2 shadow-lg shadow-[var(--accent-soft)]"
            >
              {loading ? <ButtonLoader color="#ffffff" /> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
