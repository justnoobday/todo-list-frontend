import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

let isRefreshing = false
let pendingRequests = []

function onRefreshed(token) {
  pendingRequests.forEach((cb) => cb(token))
  pendingRequests = []
}

// Request interceptor: attach Authorization header
api.interceptors.request.use((config) => {
  const access = localStorage.getItem('access_token')
  if (access) {
    config.headers['Authorization'] = `Bearer ${access}`
  }
  return config
})

// Response interceptor: handle 401 with refresh flow
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const refresh = localStorage.getItem('refresh_token')

    if (error.response && error.response.status === 401 && refresh && !originalRequest._retry) {
      if (isRefreshing) {
        // queue until refreshed
        return new Promise((resolve) => {
          pendingRequests.push((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
          headers: { 'Content-Type': 'application/json' }
        })
        const newAccess = data.access_token
        const newRefresh = data.refresh_token
        if (newAccess) localStorage.setItem('access_token', newAccess)
        if (newRefresh) localStorage.setItem('refresh_token', newRefresh)
        isRefreshing = false
        onRefreshed(newAccess)
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccess
        return api(originalRequest)
      } catch (e) {
        isRefreshing = false
        pendingRequests = []
        // logout locally
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(e)
      }
    }
    return Promise.reject(error)
  }
)

export default api
