import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Grid, Card, CardContent, Chip, Button,
  CircularProgress, Alert, Divider, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material'
import {
  LocationOn, Work, AccessTime, AttachMoney,
  ArrowBack, Send, CheckCircle, Business,
  CalendarMonth, TrendingUp
} from '@mui/icons-material'
import { setSelectedJob, setLoading, setError } from '../../features/jobs/jobsSlice'
import { addApplication } from '../../features/applications/applicationsSlice'
import { fetchJobById } from '../../services/jobService'
import { applyForJob } from '../../services/applicationService'

const InfoChip = ({ icon, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
    <Box sx={{ color: '#1a237e' }}>{icon}</Box>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
  </Box>
)

const JobDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedJob: job, loading, error } = useSelector((state) => state.jobs)
  const { user, accessToken } = useSelector((state) => state.auth)
  const { applications } = useSelector((state) => state.applications)

  const [applyDialog, setApplyDialog] = useState(false)
  const [applyForm, setApplyForm] = useState({ coverLetter: '', resumeUrl: '' })
  const [applyErrors, setApplyErrors] = useState({})
  const [applyLoading, setApplyLoading] = useState(false)
  const [applySuccess, setApplySuccess] = useState(false)

  const alreadyApplied = applications.some((a) => a.jobId === id)

  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true))
      try {
        const res = await fetchJobById(id)
        dispatch(setSelectedJob(res.data))
      } catch (err) {
        dispatch(setError('Failed to load job details'))
      } finally {
        dispatch(setLoading(false))
      }
    }
    load()
  }, [id])

  const validateApply = () => {
    const errors = {}
    if (!applyForm.coverLetter.trim()) errors.coverLetter = 'Cover letter is required'
    else if (applyForm.coverLetter.trim().length < 50)
      errors.coverLetter = 'Cover letter must be at least 50 characters'
    if (!applyForm.resumeUrl.trim()) errors.resumeUrl = 'Resume link is required'
    else if (!/^https?:\/\/.+/.test(applyForm.resumeUrl))
      errors.resumeUrl = 'Enter a valid URL (starting with http/https)'
    return errors
  }

  const handleApplySubmit = async () => {
    const errors = validateApply()
    if (Object.keys(errors).length > 0) return setApplyErrors(errors)

    setApplyLoading(true)
    try {
      const res = await applyForJob(id, applyForm)
      dispatch(addApplication({ ...res.data, jobId: id }))
      setApplySuccess(true)
      setTimeout(() => {
        setApplyDialog(false)
        setApplySuccess(false)
        setApplyForm({ coverLetter: '', resumeUrl: '' })
      }, 2000)
    } catch (err) {
      setApplyErrors({ submit: err.response?.data?.message || 'Failed to submit application' })
    } finally {
      setApplyLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !job) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        <Alert severity="error">{error || 'Job not found'}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/jobs')} sx={{ mt: 2 }}>
          Back to Jobs
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh', py: 4, px: 3 }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>

        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/jobs')}
          sx={{ mb: 3, color: '#1a237e', fontWeight: 600 }}
        >
          Back to Jobs
        </Button>

        <Grid container spacing={3}>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>

            {/* Job Header Card */}
            <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="h4" fontWeight={800} color="#1a237e" sx={{ mb: 1 }}>
                      {job.title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={500} sx={{ mb: 2 }}>
                      {job.company}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label={job.status} color={job.status === 'active' ? 'success' : 'error'}
                        size="small" sx={{ textTransform: 'capitalize' }} />
                      <Chip label={job.jobType} size="small" sx={{ bgcolor: '#e8eaf6', color: '#1a237e' }} />
                      <Chip label={job.category} size="small" variant="outlined" />
                      <Chip label={job.experienceLevel} size="small" variant="outlined" />
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      width: 72, height: 72, bgcolor: '#e8eaf6',
                      fontSize: 28, fontWeight: 800, color: '#1a237e'
                    }}
                  >
                    {job.company?.[0]?.toUpperCase()}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>

            {/* Description */}
            <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Job Description</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                  {job.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Requirements</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                    {job.requirements}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Responsibilities</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                    {job.responsibilities}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>

            {/* Apply Card */}
            <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3, position: 'sticky', top: 80 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Job Overview</Typography>

                <InfoChip icon={<LocationOn fontSize="small" />} label={job.location} />
                <InfoChip icon={<Work fontSize="small" />} label={job.jobType} />
                <InfoChip icon={<TrendingUp fontSize="small" />} label={job.experienceLevel} />
                <InfoChip icon={<Business fontSize="small" />} label={job.company} />

                {job.salaryMin && (
                  <InfoChip
                    icon={<AttachMoney fontSize="small" />}
                    label={`₹${(job.salaryMin / 100000).toFixed(1)}L${job.salaryMax ? ` - ₹${(job.salaryMax / 100000).toFixed(1)}L` : '+'}`}
                  />
                )}

                {job.deadline && (
                  <InfoChip
                    icon={<CalendarMonth fontSize="small" />}
                    label={`Deadline: ${new Date(job.deadline).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}`}
                  />
                )}

                <InfoChip
                  icon={<AccessTime fontSize="small" />}
                  label={`Posted: ${new Date(job.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}`}
                />

                <Divider sx={{ my: 2 }} />

                {alreadyApplied ? (
                  <Button fullWidth variant="contained" disabled startIcon={<CheckCircle />}
                    sx={{ borderRadius: 2, py: 1.5 }}>
                    Already Applied
                  </Button>
                ) : !accessToken ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                      Sign in to apply for this job
                    </Typography>
                    <Button
                      fullWidth variant="contained"
                      onClick={() => navigate('/login')}
                      sx={{
                        borderRadius: 2, py: 1.5, fontWeight: 700,
                        background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
                      }}
                    >
                      Sign In to Apply
                    </Button>
                  </Box>
                ) : job.status !== 'active' ? (
                  <Button fullWidth variant="contained" disabled sx={{ borderRadius: 2, py: 1.5 }}>
                    Applications Closed
                  </Button>
                ) : (
                  <Button
                    fullWidth variant="contained"
                    startIcon={<Send />}
                    onClick={() => setApplyDialog(true)}
                    sx={{
                      borderRadius: 2, py: 1.5, fontWeight: 700,
                      background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
                    }}
                  >
                    Apply Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Apply Dialog */}
      <Dialog open={applyDialog} onClose={() => setApplyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box>
            <Typography variant="h6" fontWeight={700} component="div">
              Apply for {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              {job.company}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {applySuccess ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle sx={{ fontSize: 64, color: '#2e7d32', mb: 2 }} />
              <Typography variant="h6" fontWeight={700} color="#2e7d32">
                Application Submitted!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Good luck with your application.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ pt: 1 }}>
              {applyErrors.submit && (
                <Alert severity="error" sx={{ mb: 2 }}>{applyErrors.submit}</Alert>
              )}
              <TextField
                fullWidth multiline rows={5}
                label="Cover Letter"
                placeholder="Tell the employer why you're a great fit for this role..."
                value={applyForm.coverLetter}
                onChange={(e) => {
                  setApplyForm({ ...applyForm, coverLetter: e.target.value })
                  setApplyErrors({ ...applyErrors, coverLetter: '' })
                }}
                error={!!applyErrors.coverLetter}
                helperText={applyErrors.coverLetter || `${applyForm.coverLetter.length} characters (min 50)`}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Resume URL"
                placeholder="https://drive.google.com/your-resume"
                value={applyForm.resumeUrl}
                onChange={(e) => {
                  setApplyForm({ ...applyForm, resumeUrl: e.target.value })
                  setApplyErrors({ ...applyErrors, resumeUrl: '' })
                }}
                error={!!applyErrors.resumeUrl}
                helperText={applyErrors.resumeUrl || 'Link to your resume (Google Drive, Dropbox, etc.)'}
              />
            </Box>
          )}
        </DialogContent>
        {!applySuccess && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setApplyDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              onClick={handleApplySubmit}
              variant="contained"
              disabled={applyLoading}
              startIcon={applyLoading ? <CircularProgress size={18} color="inherit" /> : <Send />}
              sx={{
                borderRadius: 2, fontWeight: 700,
                background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
              }}
            >
              {applyLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  )
}

export default JobDetails