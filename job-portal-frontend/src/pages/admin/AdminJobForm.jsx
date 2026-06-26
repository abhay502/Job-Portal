import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, Button, TextField,
  MenuItem, Select, FormControl, InputLabel, FormHelperText,
  Grid, CircularProgress, Alert, Divider, Chip
} from '@mui/material'
import { Save, ArrowBack, Work } from '@mui/icons-material'
import { setLoading, setError } from '../../features/jobs/jobsSlice'
import { createJob, updateJob, fetchJobById } from '../../services/jobService'

const CATEGORIES = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'Other']
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Manager', 'Director']
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
const STATUS_OPTIONS = ['active', 'draft', 'closed']

const initialForm = {
  title: '',
  company: '',
  location: '',
  category: '',
  experienceLevel: '',
  jobType: '',
  salaryMin: '',
  salaryMax: '',
  description: '',
  requirements: '',
  responsibilities: '',
  status: 'active',
  deadline: '',
}

const AdminJobForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const { loading, error } = useSelector((state) => state.jobs)
  const [form, setForm] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')
  const [fetchingJob, setFetchingJob] = useState(false)

  // Load job data if editing
  useEffect(() => {
    if (isEdit) {
      const loadJob = async () => {
        setFetchingJob(true)
        try {
          const res = await fetchJobById(id)
          const job = res.data
          setForm({
            title: job.title || '',
            company: job.company || '',
            location: job.location || '',
            category: job.category || '',
            experienceLevel: job.experienceLevel || '',
            jobType: job.jobType || '',
            salaryMin: job.salaryMin || '',
            salaryMax: job.salaryMax || '',
            description: job.description || '',
            requirements: job.requirements || '',
            responsibilities: job.responsibilities || '',
            status: job.status || 'active',
            deadline: job.deadline ? job.deadline.split('T')[0] : '',
          })
        } catch (err) {
          dispatch(setError('Failed to load job details'))
        } finally {
          setFetchingJob(false)
        }
      }
      loadJob()
    }
  }, [id])

  const validate = () => {
    const errors = {}
    if (!form.title.trim()) errors.title = 'Job title is required'
    if (!form.company.trim()) errors.company = 'Company name is required'
    if (!form.location.trim()) errors.location = 'Location is required'
    if (!form.category) errors.category = 'Category is required'
    if (!form.experienceLevel) errors.experienceLevel = 'Experience level is required'
    if (!form.jobType) errors.jobType = 'Job type is required'
    if (!form.description.trim()) errors.description = 'Description is required'
    else if (form.description.trim().length < 50) errors.description = 'Description must be at least 50 characters'
    if (!form.requirements.trim()) errors.requirements = 'Requirements are required'
    if (form.salaryMin && form.salaryMax && Number(form.salaryMin) > Number(form.salaryMax))
      errors.salaryMax = 'Max salary must be greater than min salary'
    if (form.deadline && new Date(form.deadline) < new Date())
      errors.deadline = 'Deadline must be a future date'
    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setFormErrors({ ...formErrors, [name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) return setFormErrors(errors)

    dispatch(setLoading(true))
    dispatch(setError(null))
    setSuccessMsg('')

    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      }
      if (isEdit) {
        await updateJob(id, payload)
        setSuccessMsg('Job updated successfully!')
      } else {
        await createJob(payload)
        setSuccessMsg('Job created successfully!')
        setForm(initialForm)
      }
      setTimeout(() => navigate('/admin/jobs'), 1500)
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to save job'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  if (fetchingJob) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/jobs')}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1a237e">
            {isEdit ? 'Edit Job' : 'Create New Job'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit ? 'Update the job posting details' : 'Fill in the details to post a new job'}
          </Typography>
        </Box>
        {isEdit && (
          <Chip label="Editing" color="warning" size="small" sx={{ ml: 'auto' }} />
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Work color="primary" />
              <Typography variant="h6" fontWeight={600}>Basic Information</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth label="Job Title" name="title"
                  value={form.title} onChange={handleChange}
                  error={!!formErrors.title} helperText={formErrors.title}
                  placeholder="e.g. Senior React Developer"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth label="Company Name" name="company"
                  value={form.company} onChange={handleChange}
                  error={!!formErrors.company} helperText={formErrors.company}
                  placeholder="e.g. TechCorp India"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth label="Location" name="location"
                  value={form.location} onChange={handleChange}
                  error={!!formErrors.location} helperText={formErrors.location}
                  placeholder="e.g. Bangalore, India"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth error={!!formErrors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select name="category" value={form.category} label="Category" onChange={handleChange}>
                    {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                  {formErrors.category && <FormHelperText>{formErrors.category}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth error={!!formErrors.experienceLevel}>
                  <InputLabel>Experience Level</InputLabel>
                  <Select name="experienceLevel" value={form.experienceLevel} label="Experience Level" onChange={handleChange}>
                    {EXPERIENCE_LEVELS.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
                  </Select>
                  {formErrors.experienceLevel && <FormHelperText>{formErrors.experienceLevel}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth error={!!formErrors.jobType}>
                  <InputLabel>Job Type</InputLabel>
                  <Select name="jobType" value={form.jobType} label="Job Type" onChange={handleChange}>
                    {JOB_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                  {formErrors.jobType && <FormHelperText>{formErrors.jobType}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Salary & Status */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Salary & Status</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth label="Min Salary (₹)" name="salaryMin" type="number"
                  value={form.salaryMin} onChange={handleChange}
                  error={!!formErrors.salaryMin} helperText={formErrors.salaryMin}
                  placeholder="e.g. 500000"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth label="Max Salary (₹)" name="salaryMax" type="number"
                  value={form.salaryMax} onChange={handleChange}
                  error={!!formErrors.salaryMax} helperText={formErrors.salaryMax}
                  placeholder="e.g. 1000000"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select name="status" value={form.status} label="Status" onChange={handleChange}>
                    {STATUS_OPTIONS.map((s) => (
                      <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth label="Application Deadline" name="deadline"
                  type="date" value={form.deadline} onChange={handleChange}
                  error={!!formErrors.deadline} helperText={formErrors.deadline}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Description */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Job Details</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth multiline rows={4} label="Job Description" name="description"
                  value={form.description} onChange={handleChange}
                  error={!!formErrors.description} helperText={formErrors.description || `${form.description.length} characters (min 50)`}
                  placeholder="Describe the role, team, and what the job entails..."
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth multiline rows={4} label="Requirements" name="requirements"
                  value={form.requirements} onChange={handleChange}
                  error={!!formErrors.requirements} helperText={formErrors.requirements}
                  placeholder="List required skills, qualifications, experience..."
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth multiline rows={4} label="Responsibilities" name="responsibilities"
                  value={form.responsibilities} onChange={handleChange}
                  error={!!formErrors.responsibilities} helperText={formErrors.responsibilities}
                  placeholder="List key responsibilities and day-to-day tasks..."
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Submit */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined" size="large"
            onClick={() => navigate('/admin/jobs')}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Cancel
          </Button>
          <Button
            type="submit" variant="contained" size="large"
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
            disabled={loading}
            sx={{ background: 'linear-gradient(135deg, #1a237e, #0d47a1)', borderRadius: 2, px: 4 }}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default AdminJobForm