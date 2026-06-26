import axiosInstance from './axiosInstance'

export const applyForJob = (jobId, data) =>
  axiosInstance.post(`/jobs/${jobId}/apply`, data)

export const fetchMyApplications = () =>
  axiosInstance.get('/applications/me')

export const fetchAllApplications = () =>
  axiosInstance.get('/applications')