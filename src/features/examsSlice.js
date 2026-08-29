import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = { items: [] }

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
      const idx = state.items.findIndex(e => e.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
    },
    deleteExam: (state, action) => {
      state.items = state.items.filter(e => e.id !== action.payload)
    },
    toggleSyllabusItem: (state, action) => {
      const { examId, item } = action.payload
      const exam = state.items.find(e => e.id === examId)
      if (exam) {
        const idx = exam.completedSyllabus.indexOf(item)
        if (idx !== -1) {
          exam.completedSyllabus.splice(idx, 1)
        } else {
          exam.completedSyllabus.push(item)
        }
        exam.prepProgress = Math.round((exam.completedSyllabus.length / exam.syllabus.length) * 100)
      }
    },
    updatePrepProgress: (state, action) => {
      const { id, progress } = action.payload
      const exam = state.items.find(e => e.id === id)
      if (exam) exam.prepProgress = progress
    },
  },
})

export const { seedExams: seedExamsAction, addExam, updateExam, deleteExam, toggleSyllabusItem, updatePrepProgress } = examsSlice.actions
export default examsSlice.reducer
