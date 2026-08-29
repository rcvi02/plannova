import { createSlice, nanoid } from '@reduxjs/toolkit'
import { format } from 'date-fns'

const initialState = { items: [] }

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    seedHabits: (state, action) => {
      if (state.items.length === 0) state.items = action.payload
    },
    addHabit: (state, action) => {
      state.items.push({ id: nanoid(), frequency: 'daily', targetDays: ['mon','tue','wed','thu','fri','sat','sun'], streak: 0, longestStreak: 0, completedDates: [], archived: false, createdAt: new Date().toISOString(), ...action.payload })
    },
    updateHabit: (state, action) => {
      const idx = state.items.findIndex(h => h.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
    },
    deleteHabit: (state, action) => {
      state.items = state.items.filter(h => h.id !== action.payload)
    },
    toggleHabitToday: (state, action) => {
      const habit = state.items.find(h => h.id === action.payload)
      if (!habit) return
      const today = format(new Date(), 'yyyy-MM-dd')
      const idx = habit.completedDates.indexOf(today)
      if (idx !== -1) {
        habit.completedDates.splice(idx, 1)
        habit.streak = Math.max(0, habit.streak - 1)
      } else {
        habit.completedDates.push(today)
        habit.streak += 1
        if (habit.streak > habit.longestStreak) habit.longestStreak = habit.streak
      }
    },
    archiveHabit: (state, action) => {
      const h = state.items.find(h => h.id === action.payload)
      if (h) h.archived = !h.archived
    },
  },
})

export const { seedHabits: seedHabitsAction, addHabit, updateHabit, deleteHabit, toggleHabitToday, archiveHabit } = habitsSlice.actions
export default habitsSlice.reducer
