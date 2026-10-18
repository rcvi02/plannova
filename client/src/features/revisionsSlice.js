import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import { addDays, format } from 'date-fns'
import api from '@/utils/api'

const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30, 90]

export const fetchRevisions = createAsyncThunk('revisions/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/revisions')
    return response.data.data.revisions || []
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch revisions')
  }
})

const initialState = { items: [], loading: false, error: null }

const revisionsSlice = createSlice({
  name: 'revisions',
  initialState,
  reducers: {
    seedRevisions: (state, action) => {
      if (state.items.length === 0) state.items = action.payload
    },
    addRevision: (state, action) => {
      state.items.push({
        id: nanoid(),
        revisionNumber: 1,
        confidence: 3,
        status: 'due',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        createdAt: new Date().toISOString(),
        ...action.payload,
      })
    },
    completeRevision: (state, action) => {
      const { id, confidence } = action.payload
      const rev = state.items.find(r => (r._id || r.id) === id)
      if (rev) {
        rev.confidence = confidence
        rev.status = 'completed'
        rev.lastCompleted = format(new Date(), 'yyyy-MM-dd')
        const interval = SPACED_REPETITION_INTERVALS[Math.min(rev.revisionNumber || 1, SPACED_REPETITION_INTERVALS.length - 1)]
        rev.nextDate = format(addDays(new Date(), interval), 'yyyy-MM-dd')
        rev.revisionNumber = (rev.revisionNumber || 1) + 1
        rev.dueDate = rev.nextDate
        rev.status = 'upcoming'
      }
    },
    rescheduleRevision: (state, action) => {
      const { id, date } = action.payload
      const rev = state.items.find(r => (r._id || r.id) === id)
      if (rev) {
        rev.dueDate = date
        rev.status = 'upcoming'
      }
    },
    deleteRevision: (state, action) => {
      state.items = state.items.filter(r => (r._id || r.id) !== action.payload)
    },
    updateRevisionStatus: (state) => {
      const today = format(new Date(), 'yyyy-MM-dd')
      state.items.forEach(r => {
        if (r.status !== 'completed' || r.dueDate <= today) {
          if (r.dueDate < today) r.status = 'overdue'
          else if (r.dueDate === today) r.status = 'due'
          else r.status = 'upcoming'
        }
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevisions.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload
        }
      })
  }
})

export const { seedRevisions: seedRevisionsAction, addRevision, completeRevision, rescheduleRevision, deleteRevision, updateRevisionStatus } = revisionsSlice.actions
export default revisionsSlice.reducer
