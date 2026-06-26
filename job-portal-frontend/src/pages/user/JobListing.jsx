import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box, Typography, Grid, Card, CardContent, Chip,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Pagination, CircularProgress, InputAdornment, Button,
  Drawer, IconButton, Divider, Slider, useMediaQuery, useTheme
} from '@mui/material'
import {
  Search, LocationOn, FilterList, Close, Work, TuneRounded
} from '@mui/icons-material'
import { setJobs, setLoading, setFilters, setPagination } from '../../features/jobs/jobsSlice'
import { fetchJobs } from '../../services/jobService'

const CATEGORIES = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'Other']
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Manager', 'Director']
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Salary: High to Low', value: 'salary_desc' },
  { label: 'Salary: Low to High', value: 'salary_asc' },
]

const JobCard = ({ job, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      borderRadius: 3, boxShadow: 2, cursor: 'pointer',
      transition: '0.3s', '&:hover': { boxShadow: 8, transform: 'translateY(-2px)' },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="h6" fontWeight={700} fontSize={16} sx={{ flex: 1, mr: 1 }}>
          {job.title}
        </Typography>
        <Chip label={job.jobType} size="small" sx={{ bgcolor: '#e8eaf6', color: '#1a237e', fontWeight: 600 }} />
      </Box>
      <Typography variant="body2" fontWeight={600} color="primary" sx={{ mb: 1 }}>
        {job.company}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
        <LocationOn fontSize="small" sx={{ color: '#757575' }} />
        <Typography variant="body2" color="text.secondary">{job.location}</Typography>
      </Box>
      <Typography
        variant="body2" color="text.secondary"
        sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
      >
        {job.description}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={job.category} size="small" variant="outlined" />
          <Chip label={job.experienceLevel} size="small" variant="outlined" />
        </Box>
        {job.salaryMin && (
          <Typography variant="body2" fontWeight={700} color="#2e7d32">
            ₹{(job.salaryMin / 100000).toFixed(1)}L
            {job.salaryMax ? ` - ₹${(job.salaryMax / 100000).toFixed(1)}L` : '+'}
          </Typography>
        )}
      </Box>
      {job.deadline && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          Apply by: {new Date(job.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </Typography>
      )}
    </CardContent>
  </Card>
)

const JobListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { jobs, loading, filters, pagination } = useSelector((state) => state.jobs)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get('category') || '',
    experienceLevel: '',
    jobType: '',
    sort: 'newest',
  })
  const [salaryRange, setSalaryRange] = useState([0, 50])
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const loadJobs = async (page = 1) => {
    dispatch(setLoading(true))
    try {
      const res = await fetchJobs({
        page,
        limit: pagination.limit,
        search,
        category: localFilters.category,
        experienceLevel: localFilters.experienceLevel,
        jobType: localFilters.jobType,
        sort: localFilters.sort,
        salaryMin: salaryRange[0] * 100000 || undefined,
        salaryMax: salaryRange[1] * 100000 || undefined,
        status: 'active',
      })
      dispatch(setJobs(res.data.jobs || res.data))
      dispatch(setPagination({
        ...pagination,
        page,
        total: res.data.total || res.data.length,
      }))
    } catch {
      dispatch(setJobs([]))
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => { loadJobs(1) }, [localFilters])

  const handleSearch = (e) => {
    e.preventDefault()
    loadJobs(1)
  }

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setSearch('')
    setLocalFilters({ category: '', experienceLevel: '', jobType: '', sort: 'newest' })
    setSalaryRange([0, 50])
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)

  const FilterPanel = () => (
    <Box sx={{ width: { xs: 280, md: '100%' }, p: { xs: 2, md: 0 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="#1a237e">Filters</Typography>
        <Button size="small" onClick={handleReset} color="error">Reset All</Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Category */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select value={localFilters.category} label="Category"
          onChange={(e) => handleFilterChange('category', e.target.value)}>
          <MenuItem value="">All Categories</MenuItem>
          {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>

      {/* Experience */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Experience Level</InputLabel>
        <Select value={localFilters.experienceLevel} label="Experience Level"
          onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}>
          <MenuItem value="">All Levels</MenuItem>
          {EXPERIENCE_LEVELS.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
        </Select>
      </FormControl>

      {/* Job Type */}
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>Job Type</InputLabel>
        <Select value={localFilters.jobType} label="Job Type"
          onChange={(e) => handleFilterChange('jobType', e.target.value)}>
          <MenuItem value="">All Types</MenuItem>
          {JOB_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
      </FormControl>

      {/* Salary Range */}
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        Salary Range: ₹{salaryRange[0]}L - ₹{salaryRange[1]}L
      </Typography>
      <Slider
        value={salaryRange}
        onChange={(_, val) => setSalaryRange(val)}
        onChangeCommitted={() => loadJobs(1)}
        min={0} max={50} step={1}
        sx={{ color: '#1a237e', mb: 2 }}
      />
    </Box>
  )

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh', py: 4, px: 3 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} color="#1a237e" sx={{ mb: 1 }}>
            Browse Jobs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {pagination.total > 0 ? `${pagination.total} jobs found` : 'Showing all available jobs'}
          </Typography>
        </Box>

        {/* Search + Sort Bar */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
            >
              <TextField
                size="small" placeholder="Search jobs, companies..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                sx={{ flex: 1, minWidth: 200 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                    )
                  }
                }}
              />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={localFilters.sort} label="Sort By"
                  onChange={(e) => handleFilterChange('sort', e.target.value)}>
                  {SORT_OPTIONS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained"
                sx={{ background: 'linear-gradient(135deg, #1a237e, #0d47a1)', borderRadius: 2 }}>
                Search
              </Button>
              {isMobile && (
                <IconButton onClick={() => setFilterDrawerOpen(true)}
                  sx={{ bgcolor: '#e8eaf6', borderRadius: 2 }}>
                  <TuneRounded color="primary" />
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Desktop Filter Sidebar */}
          {!isMobile && (
            <Grid size={{ md: 3 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2, position: 'sticky', top: 80 }}>
                <FilterPanel />
              </Card>
            </Grid>
          )}

          {/* Job List */}
          <Grid size={{ xs: 12, md: 9 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : jobs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Work sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">No jobs found.</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your filters or search terms.
                </Typography>
                <Button variant="outlined" onClick={handleReset}>Clear Filters</Button>
              </Box>
            ) : (
              <>
                <Grid container spacing={2}>
                  {jobs.map((job) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={job.id}>
                      <JobCard job={job} onClick={() => navigate(`/jobs/${job.id}`)} />
                    </Grid>
                  ))}
                </Grid>
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={pagination.page}
                      onChange={(_, page) => loadJobs(page)}
                      color="primary" shape="rounded"
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer anchor="left" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight={700}>Filters</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}><Close /></IconButton>
          </Box>
          <FilterPanel />
          <Button fullWidth variant="contained" onClick={() => setFilterDrawerOpen(false)}
            sx={{ mt: 2, background: 'linear-gradient(135deg, #1a237e, #0d47a1)', borderRadius: 2 }}>
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}

export default JobListing