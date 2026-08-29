import { createSlice } from '@reduxjs/toolkit'

const POMODORO_DURATION = 25 * 60
const SHORT_BREAK = 5 * 60
const LONG_BREAK = 15 * 60

const initialState = {
  mode: 'focus', // 'focus' | 'short-break' | 'long-break'
  timeLeft: POMODORO_DURATION,
  isRunning: false,
  sessionCount: 0,
  selectedSubjectId: null,
  selectedTaskId: null,
  todayFocusMinutes: 0,
  settings: {
    focusDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4,
  },
}

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true
    },
    pauseTimer: (state) => {
      state.isRunning = false
    },
    resetTimer: (state) => {
      state.isRunning = false
      const durations = {
        'focus': state.settings.focusDuration * 60,
        'short-break': state.settings.shortBreak * 60,
        'long-break': state.settings.longBreak * 60,
      }
      state.timeLeft = durations[state.mode]
    },
    tickTimer: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1
      } else {
        state.isRunning = false
        if (state.mode === 'focus') {
          state.sessionCount += 1
          state.todayFocusMinutes += state.settings.focusDuration
          state.mode = state.sessionCount % state.settings.longBreakInterval === 0 ? 'long-break' : 'short-break'
        } else {
          state.mode = 'focus'
        }
        const durations = {
          'focus': state.settings.focusDuration * 60,
          'short-break': state.settings.shortBreak * 60,
          'long-break': state.settings.longBreak * 60,
        }
        state.timeLeft = durations[state.mode]
      }
    },
    setMode: (state, action) => {
      state.mode = action.payload
      state.isRunning = false
      const durations = {
        'focus': state.settings.focusDuration * 60,
        'short-break': state.settings.shortBreak * 60,
        'long-break': state.settings.longBreak * 60,
      }
      state.timeLeft = durations[action.payload]
    },
    setSubject: (state, action) => {
      state.selectedSubjectId = action.payload
    },
    setTask: (state, action) => {
      state.selectedTaskId = action.payload
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload }
    },
  },
})

export const { startTimer, pauseTimer, resetTimer, tickTimer, setMode, setSubject, setTask, updateSettings } = timerSlice.actions
export default timerSlice.reducer
