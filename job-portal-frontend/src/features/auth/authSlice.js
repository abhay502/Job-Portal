import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  accessToken:  null,
  loading: false,
  error: null,
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
    },
    setLoading: (state, action) => { state.loading = action.payload },
    setError: (state, action) => { state.error = action.payload },
    setInitialized: (state) => { state.initialized = true },
  },
})

export const { setCredentials, logout, setLoading, setError, setInitialized  } = authSlice.actions
export default authSlice.reducer