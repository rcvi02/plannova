import { useEffect, useCallback, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, Clock, Flame } from 'lucide-react'
import { startTimer, pauseTimer, resetTimer, tickTimer, setMode, setSubject, setTask } from '@/features/timerSlice'
import { addSession } from '@/features/sessionsSlice'
import { format } from 'date-fns'
import { formatSeconds, formatMinutes } from '@/utils/helpers'
import toast from 'react-hot-toast'

const MODE_CONFIG = {
  focus:         { label: 'Focus',       color: 'var(--accent)',   gradient: 'var(--accent)' },
  'short-break': { label: 'Short Break', color: 'var(--success)',  gradient: 'var(--success)' },
  'long-break':  { label: 'Long Break',  color: 'var(--accent-2)', gradient: 'var(--accent-2)' },
}

export default function FocusTimerPage() {
  const dispatch = useDispatch()
  const { mode, timeLeft, isRunning, sessionCount, settings, selectedSubjectId, selectedTaskId, todayFocusMinutes } = useSelector(s => s.timer)
  const subjects     = useSelector(s => s.subjects.items)
  const tasks        = useSelector(s => s.tasks.items)
  const [soundEnabled, setSoundEnabled] = useState(false)

  const config    = MODE_CONFIG[mode]
  const totalTime = settings[mode === 'focus' ? 'focusDuration' : mode === 'short-break' ? 'shortBreak' : 'longBreak'] * 60
  const progress  = Math.min(((totalTime - timeLeft) / totalTime) * 100, 100)

  // Timer tick
  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => dispatch(tickTimer()), 1000)
    return () => clearInterval(interval)
  }, [isRunning, dispatch])

  // Session completion
  const prevTimeLeft = useRef(timeLeft)
  useEffect(() => {
    if (prevTimeLeft.current > 0 && timeLeft === 0 && mode === 'focus') {
      toast.success('Focus session complete! Great work!')
      dispatch(addSession({
        subjectId: selectedSubjectId || null,
        date:      format(new Date(), 'yyyy-MM-dd'),
        duration:  settings.focusDuration,
        topic:     'Pomodoro Session',
        rating:    4,
        notes:     '',
      }))
    }
    prevTimeLeft.current = timeLeft
  }, [timeLeft])

  // Ring sizes — responsive
  const ringSize   = typeof window !== 'undefined' && window.innerWidth < 480 ? 240 : 300
  const strokeW    = 10
  const radius     = (ringSize - strokeW * 2) / 2
  const circumference = 2 * Math.PI * radius

  const pendingTasks = tasks.filter(t => t.status !== 'completed')

  return (
    <div className="flex flex-col items-center justify-start min-h-full p-4 sm:p-6 pb-20 lg:pb-6" style={{ background: 'var(--bg-page)' }}>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Focus Timer</h1>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            Session {sessionCount + 1} · {formatMinutes(todayFocusMinutes)} focused today
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            {Object.entries(MODE_CONFIG).map(([key, cfg]) => (
              <button key={key}
                onClick={() => dispatch(setMode(key))}
                className="px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all"
                style={{
                  background: mode === key ? cfg.color : 'transparent',
                  color:      mode === key ? 'var(--text-inverse)' : 'var(--text-secondary)',
                }}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content: Timer + Controls */}
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 justify-center">
          {/* Timer Ring */}
          <div className="relative flex-shrink-0">
            {/* Ambient glow */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-[0.18]"
              style={{ background: config.color, transform: 'scale(0.7)' }}
            />
            <svg width={ringSize} height={ringSize} className="timer-ring">
              {/* BG ring */}
              <circle
                cx={ringSize / 2} cy={ringSize / 2} r={radius}
                fill="none" stroke="var(--border)" strokeWidth={strokeW}
              />
              {/* Progress ring */}
              <circle
                cx={ringSize / 2} cy={ringSize / 2} r={radius}
                fill="none"
                stroke={config.color}
                strokeWidth={strokeW}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progress / 100) * circumference}
                transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>

            {/* Inner content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2" style={{ color: config.color }}>
                {config.label}
              </span>
              <span className="text-5xl sm:text-6xl font-black font-mono" style={{ color: 'var(--text-primary)' }}>
                {formatSeconds(timeLeft)}
              </span>
              <div className="flex gap-2 mt-3">
                {Array.from({ length: settings.longBreakInterval }, (_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: i < (sessionCount % settings.longBreakInterval) ? config.color : 'var(--border)' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Controls + Selectors */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {/* Subject Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>Subject</label>
              <select
                value={selectedSubjectId || ''}
                onChange={e => dispatch(setSubject(e.target.value || null))}
                className="w-full px-3 py-2.5 text-sm rounded-xl input-focus"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="">Select subject...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              </select>
            </div>

            {/* Task Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>Task</label>
              <select
                value={selectedTaskId || ''}
                onChange={e => dispatch(setTask(e.target.value || null))}
                className="w-full px-3 py-2.5 text-sm rounded-xl input-focus"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="">Select task...</option>
                {pendingTasks.slice(0, 15).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => dispatch(resetTimer())}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-105"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)' }}
              >
                <RotateCcw size={17} />
              </button>

              <motion.button
                whileTap={{ scale: 0.93 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => isRunning ? dispatch(pauseTimer()) : dispatch(startTimer())}
                className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{ background: config.gradient, boxShadow: `0 8px 30px ${config.color}50`, color: 'var(--text-inverse)' }}
              >
                {isRunning
                  ? <Pause size={26} fill="var(--text-inverse)" color="var(--text-inverse)" />
                  : <Play size={26} fill="var(--text-inverse)" color="var(--text-inverse)" style={{ marginLeft: 3 }} />}
              </motion.button>

              <button
                onClick={() => dispatch(setMode(mode === 'focus' ? 'short-break' : 'focus'))}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-105"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)' }}
              >
                <SkipForward size={17} />
              </button>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => { setSoundEnabled(!soundEnabled); toast(soundEnabled ? 'Sound off' : 'Sound on', { icon: soundEnabled ? 'Muted' : 'Sound' }) }}
              className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm transition-colors w-full justify-center"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              {soundEnabled ? 'Sound On' : 'Sound Off'}
              <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>Soon</span>
            </button>

            {/* Today's Stats */}
            <div className="rounded-2xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Today's Stats</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Sessions',   value: sessionCount,                    icon: Flame },
                  { label: 'Focus Time', value: formatMinutes(todayFocusMinutes), icon: Clock },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <s.icon size={16} style={{ color: config.color }} />
                    <div>
                      <p className="text-base font-bold" style={{ color: config.color }}>{s.value}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
