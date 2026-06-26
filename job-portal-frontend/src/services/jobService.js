import axiosInstance from './axiosInstance'

export const fetchJobs = (params) =>
  axiosInstance.get('/jobs', { params })

export const fetchJobById = (id) =>
  axiosInstance.get(`/jobs/${id}`)

export const createJob = (data) =>
  axiosInstance.post('/jobs', data)

export const updateJob = (id, data) =>
  axiosInstance.put(`/jobs/${id}`, data)

export const deleteJob = (id) =>
  axiosInstance.delete(`/jobs/${id}`)