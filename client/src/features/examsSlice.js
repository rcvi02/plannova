import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import api from '@/utils/api'

export const fetchExams = createAsyncThunk('exams/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/exams')
    return response.data.data.exams || []
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch exams')
  }
})

export const createExamAPI = createAsyncThunk('exams/create', async (examData, { rejectWithValue }) => {
  try {
    const response = await api.post('/exams', examData)
    return response.data.data.exam
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create exam')
  }
})

export const deleteExamAPI = createAsyncThunk('exams/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/exams/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete exam')
  }
})

const initialState = { items: [], loading: false, error: null }

const examsSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    seedExams: (state, action) => {
      if (state.items.length === 0) state.items = action.payload
    },
    addExam: (state, action) => {
      state.items.push({ id: nanoid(), syllabus: [], completedSyllabus: [], prepProgress: 0, targetScore: 80, priority: 'medium', createdAt: new Date().toISOString(), ...action.payload })
    },
    updateExam: (state, action) => {
      const idx = state.items.findIndex(e => (e._id || e.id) === (action.payload._id || action.payload.id))
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
    },
    deleteExam: (state, action) => {
      state.items = state.items.filter(e => (e._id || e.id) !== action.payload)
    },
    toggleSyllabusItem: (state, action) => {
      const { examId, item } = action.payload
      const exam = state.items.find(e => (e._id || e.id) === examId)
      if (exam) {
        if (!exam.completedSyllabus) exam.completedSyllabus = []
        const idx = exam.completedSyllabus.indexOf(item)
        if (idx !== -1) {
          exam.completedSyllabus.splice(idx, 1)
        } else {
          exam.completedSyllabus.push(item)
        }
        const total = exam.syllabus?.length || 1
        exam.prepProgress = Math.round((exam.completedSyllabus.length / total) * 100)
      }
    },
    updatePrepProgress: (state, action) => {
      const { id, progress } = action.payload
      const exam = state.items.find(e => (e._id || e.id) === id)
      if (exam) exam.prepProgress = progress
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload
        }
      })
      .addCase(createExamAPI.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload)
      })
      .addCase(deleteExamAPI.fulfilled, (state, action) => {
        state.items = state.items.filter(e => (e._id || e.id) !== action.payload)
      })
  }
})

export const { seedExams: seedExamsAction, addExam, updateExam, deleteExam, toggleSyllabusItem, updatePrepProgress } = examsSlice.actions
export default examsSlice.reducer
