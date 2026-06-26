import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  applications: [],
  loading: false,
  error: null,
}

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications: (state, action) => { state.applications = action.payload },
    addApplication: (state, action) => { state.applications.push(action.payload) },
    setLoading: (state, action) => { state.loading = action.payload },
    setError: (state, action) => { state.error = action.payload },
  },
})

export const { setApplications, addApplication, setLoading, setError } = applicationsSlice.actions
export default applicationsSlice.reducer