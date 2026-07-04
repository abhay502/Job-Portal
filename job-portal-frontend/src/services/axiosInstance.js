import axios from 'axios'
import store from '../app/store'
import { setCredentials, logout } from '../features/auth/authSlice'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // allow sending cookies (for refresh token)
})

// Attach access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Auto refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
     const isRefreshCall = originalRequest?.url?.includes('/auth/refresh-token')
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          {  },{withCredentials: true}
        )
        const { accessToken, refreshToken: newRefresh, user } = res.data
        store.dispatch(setCredentials({ user, accessToken, refreshToken: newRefresh }))
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)
      } catch {
        store.dispatch(logout())
        // window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance