import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import api from '@/utils/api'

export const fetchNotes = createAsyncThunk('notes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/notes')
    return response.data.data.notes || []
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch notes')
  }
})

const initialState = { items: [], loading: false, error: null }

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    seedNotes: (state, action) => {
      if (state.items.length === 0) state.items = action.payload
    },
    addNote: (state, action) => {
      state.items.unshift({ id: nanoid(), title: 'Untitled Note', content: '', tags: [], pinned: false, favorite: false, subjectId: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...action.payload })
    },
    updateNote: (state, action) => {
      const idx = state.items.findIndex(n => (n._id || n.id) === (action.payload._id || action.payload.id))
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload, updatedAt: new Date().toISOString() }
    },
    deleteNote: (state, action) => {
      state.items = state.items.filter(n => (n._id || n.id) !== action.payload)
    },
    togglePin: (state, action) => {
      const n = state.items.find(n => (n._id || n.id) === action.payload)
      if (n) {
        n.pinned = !(n.pinned ?? n.isPinned)
        n.isPinned = n.pinned
      }
    },
    toggleFavorite: (state, action) => {
      const n = state.items.find(n => (n._id || n.id) === action.payload)
      if (n) {
        n.favorite = !(n.favorite ?? n.isFavorite)
        n.isFavorite = n.favorite
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload
        }
      })
  }
})

export const { seedNotes: seedNotesAction, addNote, updateNote, deleteNote, togglePin, toggleFavorite } = notesSlice.actions
export default notesSlice.reducer
