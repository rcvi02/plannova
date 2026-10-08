import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '@/features/authSlice'
import tasksReducer from '@/features/tasksSlice'
import subjectsReducer from '@/features/subjectsSlice'
import examsReducer from '@/features/examsSlice'
import sessionsReducer from '@/features/sessionsSlice'
import habitsReducer from '@/features/habitsSlice'
import goalsReducer from '@/features/goalsSlice'
import notesReducer from '@/features/notesSlice'
import revisionsReducer from '@/features/revisionsSlice'
import themeReducer from '@/features/themeSlice'
import timerReducer from '@/features/timerSlice'
import uiReducer from '@/features/uiSlice'

// Custom localStorage adapter — fixes "storage.getItem is not a function"
// when redux-persist/lib/storage falls back to noop under Vite ESM
const localStorageAdapter = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
}

const persistConfig = {
  key: 'plannova-root',
  storage: localStorageAdapter,
  whitelist: ['auth', 'tasks', 'subjects', 'exams', 'sessions', 'habits', 'goals', 'notes', 'revisions', 'theme', 'timer'],
}

const appReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
  subjects: subjectsReducer,
  exams: examsReducer,
  sessions: sessionsReducer,
  habits: habitsReducer,
  goals: goalsReducer,
  notes: notesReducer,
  revisions: revisionsReducer,
  theme: themeReducer,
  timer: timerReducer,
  ui: uiReducer,
})

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    // Keep the theme, clear everything else
    const { theme } = state || {}
    state = { theme }
  }
  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
