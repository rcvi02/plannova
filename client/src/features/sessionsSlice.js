import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import { format } from 'date-fns'
import api from '@/utils/api'

export const fetchSessions = createAsyncThunk('sessions/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/study-sessions')
    return response.data.data.sessions || []
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch sessions')
  }
})

export const createSessionAPI = createAsyncThunk('sessions/create', async (sessionData, { rejectWithValue }) => {
  try {
    const response = await api.post('/study-sessions', sessionData)
    return response.data.data.session
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create session')
  }
})

export const deleteSessionAPI = createAsyncThunk('sessions/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/study-sessions/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete session')
  }
})

const initialState = { items: [], loading: false, error: null }

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
      const idx = state.items.findIndex(s => (s._id || s.id) === (action.payload._id || action.payload.id))
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
    },
    deleteSession: (state, action) => {
      state.items = state.items.filter(s => (s._id || s.id) !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload
        }
      })
      .addCase(createSessionAPI.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload)
      })
      .addCase(deleteSessionAPI.fulfilled, (state, action) => {
        state.items = state.items.filter(s => (s._id || s.id) !== action.payload)
      })
  }
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
