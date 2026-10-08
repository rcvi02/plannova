import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ButtonLoader } from '@/components/ui/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, clearError } from '@/features/authSlice'
import { toast } from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [demoOtp, setDemoOtp] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { loading, error } = useSelector(state => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    
    if (email) {
      const resultAction = await dispatch(forgotPassword(email))
      if (forgotPassword.fulfilled.match(resultAction)) {
        setSubmitted(true)
        // Set OTP for demo purposes
        if (resultAction.payload?.data?.otp) {
          setDemoOtp(resultAction.payload.data.otp)
        }
      } else {
        toast.error(resultAction.payload || 'Failed to send reset link')
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
            Secure your <br/>
            <span className="gradient-text">academic future.</span>
          </h1>
          <p className="text-lg font-medium leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
            Reset your password quickly and get back to achieving your goals.
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
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-2">Reset Password</h2>
            <p className="text-[var(--text-secondary)]">Enter your email and we'll send you instructions to reset your password.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[var(--text-primary)]">Email address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@university.edu"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-[var(--border)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all outline-none text-[var(--text-primary)] bg-[var(--bg-page)] placeholder:text-[var(--text-muted)]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3.5 mt-4 rounded-xl text-sm font-semibold flex justify-center items-center gap-2"
              >
                {loading ? <ButtonLoader color="#ffffff" /> : 'Send reset link'}
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent)] text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center mx-auto mb-4" style={{ color: 'var(--accent)' }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Check your email</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                We've sent a password reset link to <br/><span className="font-semibold text-[var(--text-primary)]">{email}</span>
              </p>
              
              {demoOtp && (
                <div className="bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border)] mb-4">
                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Demo OTP Code</span>
                  <span className="text-xl font-mono font-bold tracking-widest text-[var(--text-primary)]">{demoOtp}</span>
                </div>
              )}

              <Link to="/reset-password" className="btn btn-primary w-full py-3 mb-4 rounded-xl text-sm font-semibold flex justify-center items-center">
                Proceed to Reset Password
              </Link>

              <button onClick={() => setSubmitted(false)} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                Didn't receive the email? Click to try again.
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
