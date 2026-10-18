import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import { format } from 'date-fns'
import api from '@/utils/api'

export const fetchHabits = createAsyncThunk('habits/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/habits')
    const raw = response.data.data.habits || []
    return raw.map(h => ({
      ...h,
      completedDates: h.completedDates || (h.completionHistory ? h.completionHistory.map(c => c.date) : []),
      streak: h.streak !== undefined ? h.streak : (h.currentStreak || 0),
    }))
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch habits')
  }
})

const initialState = { items: [], loading: false, error: null }

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
      const idx = state.items.findIndex(h => (h._id || h.id) === (action.payload._id || action.payload.id))
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
    },
    deleteHabit: (state, action) => {
      state.items = state.items.filter(h => (h._id || h.id) !== action.payload)
    },
    toggleHabitToday: (state, action) => {
      const habit = state.items.find(h => (h._id || h.id) === action.payload)
      if (!habit) return
      if (!habit.completedDates) habit.completedDates = []
      const today = format(new Date(), 'yyyy-MM-dd')
      const idx = habit.completedDates.indexOf(today)
      if (idx !== -1) {
        habit.completedDates.splice(idx, 1)
        habit.streak = Math.max(0, (habit.streak || 0) - 1)
      } else {
        habit.completedDates.push(today)
        habit.streak = (habit.streak || 0) + 1
        if (habit.streak > (habit.longestStreak || 0)) habit.longestStreak = habit.streak
      }
    },
    archiveHabit: (state, action) => {
      const h = state.items.find(h => (h._id || h.id) === action.payload)
      if (h) h.archived = !h.archived
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload
        }
      })
  }
})

export const { seedHabits: seedHabitsAction, addHabit, updateHabit, deleteHabit, toggleHabitToday, archiveHabit } = habitsSlice.actions
export default habitsSlice.reducer
