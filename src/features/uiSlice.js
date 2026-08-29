import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  commandPaletteOpen: false,
  addTaskModalOpen: false,
  notifications: [],
  activeModal: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen
    },
    setCommandPalette: (state, action) => {
      state.commandPaletteOpen = action.payload
    },
    toggleAddTaskModal: (state) => {
      state.addTaskModalOpen = !state.addTaskModalOpen
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload
    },
    addNotification: (state, action) => {
      state.notifications.unshift({ id: Date.now(), read: false, ...action.payload })
    },
    markNotificationRead: (state, action) => {
      const n = state.notifications.find(n => n.id === action.payload)
      if (n) n.read = true
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const { toggleCommandPalette, setCommandPalette, toggleAddTaskModal, setActiveModal, addNotification, markNotificationRead, clearNotifications } = uiSlice.actions
export default uiSlice.reducer
