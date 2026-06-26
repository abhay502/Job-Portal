import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Grid, Card, CardContent,
  Chip, CircularProgress, Avatar, InputBase, IconButton, Paper
} from '@mui/material'
import {
  Search, LocationOn, Work, TrendingUp,
  Computer, HealthAndSafety, AccountBalance,
  Brush, Campaign, School, ArrowForward
} from '@mui/icons-material'
import { setJobs, setLoading } from '../../features/jobs/jobsSlice'
import { fetchJobs } from '../../services/jobService'
import { useState } from 'react'
import { useRef } from 'react'

const CATEGORIES = [
  { label: 'Technology', icon: <Computer />, color: '#1a237e', bg: '#e8eaf6' },
  { label: 'Healthcare', icon: <HealthAndSafety />, color: '#2e7d32', bg: '#e8f5e9' },
  { label: 'Finance', icon: <AccountBalance />, color: '#e65100', bg: '#fff3e0' },
  { label: 'Design', icon: <Brush />, color: '#6a1b9a', bg: '#f3e5f5' },
  { label: 'Marketing', icon: <Campaign />, color: '#00838f', bg: '#e0f7fa' },
  { label: 'Education', icon: <School />, color: '#c62828', bg: '#ffebee' },
]

const JobCard = ({ job, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      borderRadius: 3, boxShadow: 2, cursor: 'pointer',
      transition: '0.3s', '&:hover': { boxShadow: 8, transform: 'translateY(-4px)' },
      height: '100%'
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="h6" fontWeight={700} fontSize={16}>{job.title}</Typography>
        <Chip label={job.jobType} size="small" sx={{ bgcolor: '#e8eaf6', color: '#1a237e', fontWeight: 600 }} />
      </Box>
      <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
        {job.company}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
        <LocationOn fontSize="small" sx={{ color: '#757575' }} />
        <Typography variant="body2" color="text.secondary">{job.location}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
        <Chip label={job.category} size="small" variant="outlined" />
        <Chip label={job.experienceLevel} size="small" variant="outlined" />
        {job.salaryMin && (
          <Chip
            label={`₹${(job.salaryMin / 100000).toFixed(1)}L${job.salaryMax ? ` - ₹${(job.salaryMax / 100000).toFixed(1)}L` : '+'}`}
            size="small"
            sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}
          />
        )}
      </Box>
    </CardContent>
  </Card>
)

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { jobs, loading } = useSelector((state) => state.jobs)
  const [searchQuery, setSearchQuery] = useState('')
  const jobsSectionRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true))
      try {
        const res = await fetchJobs({ limit: 6, status: 'active' })
        dispatch(setJobs(res.data.jobs || res.data))
      } catch {
        dispatch(setJobs([]))
      } finally {
        dispatch(setLoading(false))
      }
    }
    load()
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/jobs?search=${searchQuery}`)
  }

  const handleCategoryClick = (category) => {
    navigate(`/jobs?category=${category}`)
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 60%, #01579b 100%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
          px: 3,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}
        >
          Find Your Dream Job
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: 4, color: '#90caf9', fontWeight: 400, fontSize: { xs: '1rem', md: '1.25rem' } }}
        >
          Thousands of opportunities from top companies across India
        </Typography>

        {/* Search Bar */}
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex', alignItems: 'center',
            maxWidth: 600, mx: 'auto', borderRadius: 3,
            px: 2, py: 0.5, boxShadow: 6,
          }}
        >
          <Search sx={{ color: '#757575', mr: 1 }} />
          <InputBase
            placeholder="Job title, company, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, fontSize: 16 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 2, fontWeight: 700,
              background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
            }}
          >
            Search
          </Button>
        </Paper>

        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 3, md: 6 }, mt: 5 }}>
          {[
            { label: 'Jobs Posted', value: '10K+', icon: <Work /> },
            { label: 'Companies', value: '500+', icon: <TrendingUp /> },
            { label: 'Hired', value: '25K+', icon: <TrendingUp /> },
          ].map((stat) => (
            <Box key={stat.label} sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={800}>{stat.value}</Typography>
              <Typography variant="body2" sx={{ color: '#90caf9' }}>{stat.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8, px: 3, backgroundColor: '#f5f7fa' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Typography variant="h4" fontWeight={700} sx={{ textAlign: 'center', mb: 1 }} color="#1a237e">
            Browse by Category
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 5 }}>
            Explore opportunities across top industries
          </Typography>
          <Grid container spacing={3}>
            {CATEGORIES.map((cat) => (
              <Grid size={{ xs: 6, sm: 4, md: 2 }} key={cat.label}>
                <Card
                  onClick={() => handleCategoryClick(cat.label)}
                  sx={{
                    borderRadius: 3, boxShadow: 2, cursor: 'pointer', textAlign: 'center',
                    transition: '0.3s', '&:hover': { boxShadow: 8, transform: 'translateY(-4px)' },
                  }}
                >
                  <CardContent sx={{ py: 3 }}>
                    <Avatar sx={{ bgcolor: cat.bg, mx: 'auto', mb: 1, width: 52, height: 52 }}>
                      <Box sx={{ color: cat.color }}>{cat.icon}</Box>
                    </Avatar>
                    <Typography variant="body2" fontWeight={600}>{cat.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Featured Jobs */}
      <Box sx={{ py: 8, px: 3 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#1a237e" sx={{ mb: 1 }}>
                Featured Jobs
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hand-picked opportunities from top employers
              </Typography>
            </Box>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate('/jobs')}
              variant="outlined"
              sx={{ borderRadius: 2, fontWeight: 600, display: { xs: 'none', md: 'flex' } }}
            >
              View All Jobs
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : jobs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Work sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No jobs available yet.</Typography>
              <Typography variant="body2" color="text.secondary">Check back soon!</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {jobs.map((job) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={job.id}>
                  <JobCard job={job} onClick={() => navigate(`/jobs/${job.id}`)} />
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ textAlign: 'center', mt: 4, display: { xs: 'block', md: 'none' } }}>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate('/jobs')}
              variant="outlined"
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              View All Jobs
            </Button>
          </Box>
        </Box>
      </Box>

      {/* CTA Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
          color: '#fff', py: 8, px: 3, textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
          Ready to Take the Next Step?
        </Typography>
        <Typography variant="body1" sx={{ color: '#90caf9', mb: 4 }}>
          Join thousands of professionals who found their perfect job on JobPortal
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/jobs')}
          sx={{
            bgcolor: '#fff', color: '#1a237e', fontWeight: 700,
            borderRadius: 2, px: 4,
            '&:hover': { bgcolor: '#e3f2fd' },
          }}
        >
          Browse All Jobs
        </Button>
      </Box>
    </Box>
  )
}

export default Home