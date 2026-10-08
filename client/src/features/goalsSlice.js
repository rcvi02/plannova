import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'

export const fetchGoals = createAsyncThunk('goals/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/goals')
    return response.data.data.goals || response.data.data || []
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch goals')
  }
})

export const addGoal = createAsyncThunk('goals/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/goals', data)
    return response.data.data.goal || response.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create goal')
  }
})

export const updateGoal = createAsyncThunk('goals/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/goals/${id}`, data)
    return response.data.data.goal || response.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update goal')
  }
})

export const deleteGoal = createAsyncThunk('goals/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/goals/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete goal')
  }
})

export const updateGoalProgress = createAsyncThunk('goals/progress', async ({ id, current }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/goals/${id}`, { current })
    return response.data.data.goal || response.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update progress')
  }
})

export const toggleMilestone = createAsyncThunk('goals/milestone', async ({ goalId, milestone }, { rejectWithValue }) => {
  // In a real app we'd have a specific endpoint or just update the whole goal
  try {
    // Optimistic fetch & update
    return { goalId, milestone }
  } catch (err) {
    return rejectWithValue('Failed')
  }
})

const initialState = { items: [], loading: false, error: null }

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    seedGoals: (state, action) => {
      if (state.items.length === 0) state.items = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => { state.loading = true })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const idx = state.items.findIndex(g => g._id === action.payload._id || g.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter(g => g._id !== action.payload && g.id !== action.payload)
      })
      .addCase(updateGoalProgress.fulfilled, (state, action) => {
        const idx = state.items.findIndex(g => g._id === action.payload._id || g.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(toggleMilestone.fulfilled, (state, action) => {
        const { goalId, milestone } = action.payload
        const goal = state.items.find(g => g.id === goalId || g._id === goalId)
        if (goal) {
          if (!goal.completedMilestones) goal.completedMilestones = []
          const idx = goal.completedMilestones.indexOf(milestone)
          if (idx !== -1) goal.completedMilestones.splice(idx, 1)
          else goal.completedMilestones.push(milestone)
        }
      })
  }
})

export const { seedGoals: seedGoalsAction } = goalsSlice.actions
export default goalsSlice.reducer
