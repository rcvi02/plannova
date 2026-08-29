import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-page)' }}>
      <Outlet />
    </div>
  )
}
