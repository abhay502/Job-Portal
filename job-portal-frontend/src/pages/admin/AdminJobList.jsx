import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, IconButton, MenuItem, Select,
  FormControl, InputLabel, Pagination, CircularProgress,
  Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, InputAdornment
} from '@mui/material'
import {
  Add, Edit, Delete, Search, FilterList, Work
} from '@mui/icons-material'
import { setJobs, setLoading, setError, setFilters, setPagination } from '../../features/jobs/jobsSlice'
import { fetchJobs, deleteJob } from '../../services/jobService'

const CATEGORIES = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Design', 'Sales', 'Other']
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Manager', 'Director']
const STATUS_OPTIONS = ['all', 'active', 'draft', 'closed']

const statusColor = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'closed': return 'error'
    case 'draft': return 'warning'
    default: return 'default'
  }
}

const AdminJobList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { jobs, loading, error, filters, pagination } = useSelector((state) => state.jobs)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const loadJobs = async (page = 1) => {
    dispatch(setLoading(true))
    try {
      const res = await fetchJobs({
        page,
        limit: pagination.limit,
        category: filters.category,
        experienceLevel: filters.experienceLevel,
        search,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      })
      dispatch(setJobs(res.data.jobs || res.data))
      dispatch(setPagination({
        ...pagination,
        page,
        total: res.data.total || res.data.length,
      }))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to load jobs'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => { loadJobs(1) }, [filters, statusFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    loadJobs(1)
  }

  const handlePageChange = (_, page) => loadJobs(page)

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }))
  }

  const handleDeleteClick = (job) => {
    setJobToDelete(job)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true)
    try {
      await deleteJob(jobToDelete.id)
      setDeleteDialogOpen(false)
      loadJobs(pagination.page)
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to delete job'))
    } finally {
      setDeleteLoading(false)
    }
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1a237e">All Jobs</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor all job postings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/jobs/new')}
          sx={{ background: 'linear-gradient(135deg, #1a237e, #0d47a1)', borderRadius: 2 }}
        >
          Post a Job
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FilterList color="primary" />
            <Typography fontWeight={600}>Filters</Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}
          >
            <TextField
              size="small"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, minWidth: 200 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                  )
                }
              }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Experience</InputLabel>
              <Select
                value={filters.experienceLevel}
                label="Experience"
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
              >
                <MenuItem value="">All Levels</MenuItem>
                {EXPERIENCE_LEVELS.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained"
              sx={{ background: 'linear-gradient(135deg, #1a237e, #0d47a1)', borderRadius: 2 }}
            >
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Error */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Table */}
      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : jobs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Work sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
              <Typography color="text.secondary">No jobs found.</Typography>
              <Button
                variant="contained"
                sx={{ mt: 2, background: 'linear-gradient(135deg, #1a237e, #0d47a1)' }}
                onClick={() => navigate('/admin/jobs/new')}
              >
                Post a Job
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                      <TableCell><Typography fontWeight={600}>#</Typography></TableCell>
                      <TableCell><Typography fontWeight={600}>Job Title</Typography></TableCell>
                      <TableCell><Typography fontWeight={600}>Category</Typography></TableCell>
                      <TableCell><Typography fontWeight={600}>Experience</Typography></TableCell>
                      <TableCell><Typography fontWeight={600}>Location</Typography></TableCell>
                      <TableCell><Typography fontWeight={600}>Status</Typography></TableCell>
                      <TableCell><Typography fontWeight={600}>Posted</Typography></TableCell>
                      <TableCell align="center"><Typography fontWeight={600}>Actions</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jobs.map((job, index) => (
                      <TableRow key={job.id} hover>
                        <TableCell>{(pagination.page - 1) * pagination.limit + index + 1}</TableCell>
                        <TableCell>
                          <Typography fontWeight={600}>{job.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{job.company}</Typography>
                        </TableCell>
                        <TableCell>{job.category}</TableCell>
                        <TableCell>{job.experienceLevel}</TableCell>
                        <TableCell>{job.location}</TableCell>
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
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(job)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Delete Job</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{jobToDelete?.title}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminJobList