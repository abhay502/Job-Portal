import axiosInstance from './axiosInstance'

export const loginAdmin = (credentials) =>
  axiosInstance.post('/auth/admin/login', credentials)

export const loginUser = (credentials) =>
  axiosInstance.post('/auth/user/login', credentials)

export const registerUser = (data) =>
  axiosInstance.post('/auth/user/register', data)

export const refreshToken = (token) =>
  axiosInstance.post('/auth/refresh-token', { refreshToken: token })

export const getMe = () => axiosInstance.get('/auth/me')