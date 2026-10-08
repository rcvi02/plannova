import { createSlice, nanoid } from '@reduxjs/toolkit'
import { format } from 'date-fns'

const initialState = { items: [] }

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    seedSessions: (state, action) => {
      if (state.items.length === 0) state.items = action.payload
    },
    addSession: (state, action) => {
      state.items.unshift({ id: nanoid(), date: format(new Date(), 'yyyy-MM-dd'), duration: 0, topic: '', rating: 3, notes: '', createdAt: new Date().toISOString(), ...action.payload })
    },
    updateSession: (state, action) => {
      const idx = state.items.findIndex(s => s.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
    },
    deleteSession: (state, action) => {
      state.items = state.items.filter(s => s.id !== action.payload)
    },
  },
})

export const { seedSessions: seedSessionsAction, addSession, updateSession, deleteSession } = sessionsSlice.actions
export default sessionsSlice.reducer

export const selectTodayStudyTime = (state) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  return state.sessions.items.filter(s => s.date === today).reduce((acc, s) => acc + (s.duration || 0), 0)
}
export const selectWeeklyStudyTime = (state) => {
  return state.sessions.items.slice(0, 7).reduce((acc, s) => acc + (s.duration || 0), 0)
}
