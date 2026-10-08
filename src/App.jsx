import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'

// Layouts
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from '@/layouts/AuthLayout'

// Redux imports
import { logout } from '@/features/authSlice'
import { fetchTasks } from '@/features/tasksSlice'
import { fetchSubjects } from '@/features/subjectsSlice'
import { fetchGoals } from '@/features/goalsSlice'
import { fetchMe } from '@/features/authSlice'

import { seedExamsAction } from '@/features/examsSlice'
import { seedSessionsAction } from '@/features/sessionsSlice'
import { seedHabitsAction } from '@/features/habitsSlice'
import { seedNotesAction } from '@/features/notesSlice'
import { seedRevisionsAction } from '@/features/revisionsSlice'
import { setSeeded } from '@/features/authSlice'
import { seedExams, seedSessions, seedHabits, seedNotes, seedRevisions } from '@/utils/seedData'

// Suspense fallback
import PageLoader from '@/components/ui/PageLoader'

// Lazy pages
const LandingPage = lazy(() => import('@/pages/Landing/LandingPage'))
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/Auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/Auth/ResetPasswordPage'))
const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'))
const TodayPage = lazy(() => import('@/pages/Today/TodayPage'))
const PlannerPage = lazy(() => import('@/pages/Planner/PlannerPage'))
const CalendarPage = lazy(() => import('@/pages/Calendar/CalendarPage'))
const SubjectsPage = lazy(() => import('@/pages/Subjects/SubjectsPage'))
const SubjectDetailPage = lazy(() => import('@/pages/Subjects/SubjectDetailPage'))
const TasksPage = lazy(() => import('@/pages/Tasks/TasksPage'))
const ExamsPage = lazy(() => import('@/pages/Exams/ExamsPage'))
const ExamDetailPage = lazy(() => import('@/pages/Exams/ExamDetailPage'))
const FocusTimerPage = lazy(() => import('@/pages/FocusTimer/FocusTimerPage'))
const SessionsPage = lazy(() => import('@/pages/Sessions/SessionsPage'))
const NotesPage = lazy(() => import('@/pages/Notes/NotesPage'))
const RevisionPage = lazy(() => import('@/pages/Revision/RevisionPage'))
const GoalsPage = lazy(() => import('@/pages/Goals/GoalsPage'))
const HabitsPage = lazy(() => import('@/pages/Habits/HabitsPage'))
const AnalyticsPage = lazy(() => import('@/pages/Analytics/AnalyticsPage'))
const SettingsPage = lazy(() => import('@/pages/Settings/SettingsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(s => s.auth.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, isSeeded } = useSelector(s => s.auth)
  const [isInitializing, setIsInitializing] = useState(true)

  // Fetch user data and bootstrap application
  useEffect(() => {
    const bootstrap = async () => {
      // Setup global event listener for unauthorized
      const handleUnauthorized = () => {
        dispatch(logout())
      }
      window.addEventListener('auth:unauthorized', handleUnauthorized)

      if (isAuthenticated) {
        try {
           await dispatch(fetchMe()).unwrap()
           dispatch(fetchSubjects())
           dispatch(fetchTasks())
           dispatch(fetchGoals())
           // Remove seeding so new users start completely blank
           if (!isSeeded) {
             dispatch(setSeeded())
           }
        } catch (error) {
           console.error("Failed to bootstrap data", error)
        }
      }

      // Remove the intentional delay to make the app load faster
      setIsInitializing(false)

      return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }

    bootstrap()
  }, [isAuthenticated, dispatch])

  // Sync theme with Redux state and system preference
  const themeMode = useSelector(s => s.theme.mode)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const applyTheme = () => {
      let isDark = themeMode === 'dark'
      if (themeMode === 'system') {
        isDark = mediaQuery.matches
      }
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    applyTheme() // Apply initially and when themeMode changes

    const handleChange = () => {
      if (themeMode === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  if (isInitializing) {
    return <PageLoader />
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected App */}
        <Route path="/app" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="today" element={<TodayPage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="subjects/:id" element={<SubjectDetailPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="exams" element={<ExamsPage />} />
          <Route path="exams/:id" element={<ExamDetailPage />} />
          <Route path="timer" element={<FocusTimerPage />} />
          <Route path="sessions" element={<SessionsPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="revision" element={<RevisionPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="habits" element={<HabitsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
