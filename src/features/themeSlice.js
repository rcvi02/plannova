import { createSlice } from '@reduxjs/toolkit'

const savedTheme = localStorage.getItem('studyflow-theme')
const initialState = {
  mode: savedTheme || 'light', // 'light' | 'dark'
  sidebarCollapsed: false,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload
      localStorage.setItem('studyflow-theme', action.payload)
      const isDark = action.payload === 'dark'
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload
    },
  },
})

export const { setTheme, toggleSidebar, setSidebarCollapsed } = themeSlice.actions
export default themeSlice.reducer
