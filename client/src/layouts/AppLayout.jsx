import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import CommandPalette from '@/components/ui/CommandPalette'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import { toggleCommandPalette } from '@/features/uiSlice'

import ProductTour from '@/components/ui/ProductTour'

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
}

export default function AppLayout() {
  const location = useLocation()
  const dispatch = useDispatch()
  const commandPaletteOpen = useSelector(s => s.ui.commandPaletteOpen)
  const commandPaletteOpenRef = useRef(commandPaletteOpen)

  useEffect(() => { commandPaletteOpenRef.current = commandPaletteOpen }, [commandPaletteOpen])

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        dispatch(toggleCommandPalette())
      }
      if (e.key === 'Escape' && commandPaletteOpenRef.current) {
        dispatch(toggleCommandPalette())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [dispatch])

  return (
    <div className="flex h-[100dvh] w-full max-w-[2000px] mx-auto overflow-hidden relative shadow-2xl" style={{ background: 'var(--bg-page)' }}>
      <ProductTour />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden" id="main-content">
        <Navbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />

      {/* Command Palette */}
      <AnimatePresence>
        {commandPaletteOpen && <CommandPalette />}
      </AnimatePresence>
    </div>
  )
}
