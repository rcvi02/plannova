import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  return (
    <div className="min-h-[100dvh] w-full max-w-[2000px] mx-auto flex shadow-2xl" style={{ background: 'var(--bg-page)' }}>
      <Outlet />
    </div>
  )
}
