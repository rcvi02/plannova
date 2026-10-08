import { createSlice } from '@reduxjs/toolkit'

const savedTheme = localStorage.getItem('plannova-theme')
const initialState = {
  mode: savedTheme || 'system', // 'light' | 'dark' | 'system'
  sidebarCollapsed: false,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload
      localStorage.setItem('plannova-theme', action.payload)
      let isDark = action.payload === 'dark'
      if (action.payload === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
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
