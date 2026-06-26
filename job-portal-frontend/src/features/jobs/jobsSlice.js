import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  jobs: [],
  selectedJob: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
  filters: { category: '', experienceLevel: '' },
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action) => { state.jobs = action.payload },
    setSelectedJob: (state, action) => { state.selectedJob = action.payload },
    setLoading: (state, action) => { state.loading = action.payload },
    setError: (state, action) => { state.error = action.payload },
    setPagination: (state, action) => { state.pagination = action.payload },
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    resetFilters: (state) => { state.filters = { category: '', experienceLevel: '' } },
  },
})

export const { setJobs, setSelectedJob, setLoading, setError, setPagination, setFilters, resetFilters } = jobsSlice.actions
export default jobsSlice.reducer