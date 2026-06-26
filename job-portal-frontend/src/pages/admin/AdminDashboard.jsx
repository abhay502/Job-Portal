import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress, Avatar
} from '@mui/material'
import {
  Work, People, CheckCircle, TrendingUp, AddCircleOutlined, Visibility
} from '@mui/icons-material'
import { setJobs, setLoading, setError } from '../../features/jobs/jobsSlice'
import { fetchJobs } from '../../services/jobService'

const statCards = (jobs) => [
  {
    label: 'Total Jobs',
    value: jobs.length,
    icon: <Work fontSize="large" />,
    color: '#1a237e',
    bg: '#e8eaf6',
  },
  {
    label: 'Active Jobs',
    value: jobs.filter((j) => j.status === 'active').length,
    icon: <CheckCircle fontSize="large" />,
    color: '#2e7d32',
    bg: '#e8f5e9',
  },
  {
    label: 'Total Applications',
    value: jobs.reduce((acc, j) => acc + (j._count?.applications || 0), 0),
    icon: <People fontSize="large" />,
    color: '#e65100',
    bg: '#fff3e0',
  },
  {
    label: 'This Month',
    value: jobs.filter((j) => {
      const created = new Date(j.createdAt)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length,
    icon: <TrendingUp fontSize="large" />,
    color: '#6a1b9a',
    bg: '#f3e5f5',
  },
]

const statusColor = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'closed': return 'error'
    case 'draft': return 'warning'
    default: return 'default'
  }
}

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { jobs, loading, error } = useSelector((state) => state.jobs)

  useEffect(() => {
    const loadJobs = async () => {
      dispatch(setLoading(true))
      try {
        const res = await fetchJobs({ limit: 100 })
        dispatch(setJobs(res.data.jobs || res.data))
      } catch (err) {
        dispatch(setError(err.response?.data?.message || 'Failed to load jobs'))
      } finally {
        dispatch(setLoading(false))
      }
    }
    loadJobs()
  }, [dispatch])

  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1a237e">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's what's happening.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlined />}
          onClick={() => navigate('/admin/jobs/new')}
          sx={{ background: 'linear-gradient(135deg, #1a237e, #0d47a1)', borderRadius: 2 }}
        >
          Post a Job
        </Button>
      </Box>

      {/* Stat Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statCards(jobs).map((card) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
                <Card sx={{ borderRadius: 3, boxShadow: 2, '&:hover': { boxShadow: 6 }, transition: '0.3s' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {card.label}
                        </Typography>
                        <Typography variant="h4" fontWeight={700} color={card.color}>
                          {card.value}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: card.bg, width: 56, height: 56 }}>
                        <Box sx={{ color: card.color }}>{card.icon}</Box>
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Jobs Table */}
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Recent Jobs
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate('/admin/jobs')}
                  startIcon={<Visibility />}
                >
                  View All
                </Button>
              </Box>

              {recentJobs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Work sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
                  <Typography color="text.secondary">No jobs posted yet.</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, background: 'linear-gradient(135deg, #1a237e, #0d47a1)' }}
                    onClick={() => navigate('/admin/jobs/new')}
                  >
                    Post Your First Job
                  </Button>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                        <TableCell><Typography fontWeight={600}>Job Title</Typography></TableCell>
                        <TableCell><Typography fontWeight={600}>Category</Typography></TableCell>
                        <TableCell><Typography fontWeight={600}>Experience</Typography></TableCell>
                        <TableCell><Typography fontWeight={600}>Status</Typography></TableCell>
                        <TableCell><Typography fontWeight={600}>Posted</Typography></TableCell>
                        <TableCell><Typography fontWeight={600}>Action</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentJobs.map((job) => (
                        <TableRow key={job.id} hover>
                          <TableCell>
                            <Typography fontWeight={600}>{job.title}</Typography>
                            <Typography variant="caption" color="text.secondary">{job.company}</Typography>
                          </TableCell>
                          <TableCell>{job.category}</TableCell>
                          <TableCell>{job.experienceLevel}</TableCell>
                          <TableCell>
                            <Chip
                              label={job.status}
                              color={statusColor(job.status)}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(job.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  )
}

export default AdminDashboard