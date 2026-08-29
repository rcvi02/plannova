import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = { items: [] }

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
      const idx = state.items.findIndex(n => n.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload, updatedAt: new Date().toISOString() }
    },
    deleteNote: (state, action) => {
      state.items = state.items.filter(n => n.id !== action.payload)
    },
    togglePin: (state, action) => {
      const n = state.items.find(n => n.id === action.payload)
      if (n) n.pinned = !n.pinned
    },
    toggleFavorite: (state, action) => {
      const n = state.items.find(n => n.id === action.payload)
      if (n) n.favorite = !n.favorite
    },
  },
})

export const { seedNotes: seedNotesAction, addNote, updateNote, deleteNote, togglePin, toggleFavorite } = notesSlice.actions
export default notesSlice.reducer
