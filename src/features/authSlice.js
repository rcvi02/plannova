import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'

// Async Thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData)
      localStorage.setItem('token', response.data.data.token)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      localStorage.setItem('token', response.data.data.token)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

export const googleLoginUser = createAsyncThunk(
  'auth/googleLogin',
  async (credential, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/google', { credential })
      localStorage.setItem('token', response.data.data.token)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Google Login failed')
    }
  }
)

export const fetchMe = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me')
      return response.data.data.user
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      return response.data.data.user
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed')
    }
  }
)

const initialState = {
  user: null,
  isAuthenticated: false,
  isSeeded: false, // Keeping for backward compatibility with initial startup script, though we'll remove seed data eventually
  loading: false,
  error: null,
  token: localStorage.getItem('token') || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    },
    // We still keep loginDemo to test UI if DB is empty
    loginDemo: (state, action) => {
      state.user = action.payload || {
        name: 'Alex Chen',
        email: 'alex@studyflow.com',
        streak: 12
      }
      state.isAuthenticated = true
      state.token = 'demo-token'
      localStorage.setItem('token', 'demo-token')
    },
    setSeeded: (state) => {
      state.isSeeded = true
    },
    updateStreak: (state, action) => {
      if (state.user) {
        state.user.streak = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data.user
        state.token = action.payload.data.token
        state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data.user
        state.token = action.payload.data.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Me
      .addCase(fetchMe.pending, (state) => {
        state.loading = true
      })
      .addCase(googleLoginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data.user
        state.token = action.payload.data.token
        state.isAuthenticated = true
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        localStorage.removeItem('token')
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { logout, clearError, loginDemo, setSeeded, updateStreak } = authSlice.actions
export default authSlice.reducer
