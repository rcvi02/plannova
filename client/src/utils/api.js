import axios from 'axios'

const getBaseURL = () => {
  let envUrl = import.meta.env.VITE_API_URL
  if (envUrl) {
    envUrl = envUrl.trim().replace(/\/+$/, '')
    if (!envUrl.endsWith('/api')) {
      envUrl += '/api'
    }
    return envUrl
  }
  return import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      // Custom event to handle logout globally without circular dependency
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)

export default api
