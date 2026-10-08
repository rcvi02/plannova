import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'
import { format } from 'date-fns'

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/tasks')
    return response.data.data.tasks || []
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks')
  }
})

export const createTask = createAsyncThunk('tasks/create', async (taskData, { rejectWithValue }) => {
  try {
    const response = await api.post('/tasks', taskData)
    return response.data.data.task
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create task')
  }
})

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/tasks/${id}`, data)
    return response.data.data.task
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update task')
  }
})

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete task')
  }
})

const initialState = {
  items: [],
  filter: 'all',
  sortBy: 'dueDate',
  view: 'list',
  loading: false,
  error: null
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setView: (state, action) => {
      state.view = action.payload
    },
    // Temporary helper for offline/sync if needed
    seedTasks: (state, action) => {
      if (state.items.length === 0) {
        state.items = action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t._id === action.payload._id || t.id === action.payload._id)
        if (idx !== -1) {
          state.items[idx] = action.payload
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload && t.id !== action.payload)
      })
  }
})

export const { setFilter, setSortBy, setView, seedTasks } = tasksSlice.actions

export default tasksSlice.reducer

export const selectTodayTasks = (state) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  return state.tasks.items.filter(t => t.dueDate && t.dueDate.startsWith(today))
}
export const selectTasksBySubject = (subjectId) => (state) =>
  state.tasks.items.filter(t => t.subject === subjectId || t.subjectId === subjectId)
export const selectPendingTasks = (state) => state.tasks.items.filter(t => t.status === 'pending')
export const selectCompletedToday = (state) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  return state.tasks.items.filter(t => t.status === 'completed' && t.completedAt?.startsWith(today))
}
