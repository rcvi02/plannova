import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'

export const fetchSubjects = createAsyncThunk('subjects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/subjects')
    return response.data.data.subjects || []
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch subjects')
  }
})

export const createSubject = createAsyncThunk('subjects/create', async (subjectData, { rejectWithValue }) => {
  try {
    const response = await api.post('/subjects', subjectData)
    return response.data.data.subject
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create subject')
  }
})

export const updateSubjectAPI = createAsyncThunk('subjects/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/subjects/${id}`, data)
    return response.data.data.subject
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update subject')
  }
})

export const deleteSubjectAPI = createAsyncThunk('subjects/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/subjects/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete subject')
  }
})

const initialState = { items: [], loading: false, error: null }

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    // Temporary for demo purposes if needed
    seedSubjects: (state, action) => {
      if (state.items.length === 0) state.items = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => { state.loading = true })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload)
      })
      .addCase(updateSubjectAPI.fulfilled, (state, action) => {
        const idx = state.items.findIndex(s => s._id === action.payload._id || s.id === action.payload._id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(deleteSubjectAPI.fulfilled, (state, action) => {
        state.items = state.items.filter(s => s._id !== action.payload && s.id !== action.payload)
      })
  },
})

export const { seedSubjects: seedSubjectsAction } = subjectsSlice.actions
export default subjectsSlice.reducer
export const selectSubjectById = (id) => (state) => state.subjects.items.find(s => s._id === id || s.id === id)
