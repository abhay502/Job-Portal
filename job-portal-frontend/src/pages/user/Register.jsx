import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button,
  Typography, InputAdornment, IconButton, Alert,
  CircularProgress, Divider
} from '@mui/material'
import { Visibility, VisibilityOff, Work } from '@mui/icons-material'
import axios from 'axios'

const Register = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Full name is required'
    else if (form.name.trim().length < 3) errors.name = 'Name must be at least 3 characters'
    if (!form.email) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email'
    if (!form.password) errors.password = 'Password is required'
    else if (form.password.length < 6) errors.password = 'Minimum 6 characters'
    else if (!/(?=.*[0-9])/.test(form.password)) errors.password = 'Password must contain at least one number'
    if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match'
    return errors
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) return setFormErrors(errors)

    setLoading(true)
    setError(null)
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/user/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f7fa 100%)',
        py: 4,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 460, borderRadius: 3, boxShadow: 10 }}>
        <CardContent sx={{ p: 4 }}>

          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 60, height: 60, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a237e, #0d47a1)', mb: 2,
              }}
            >
              <Work sx={{ color: '#fff', fontSize: 30 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="primary">
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Join JobPortal and find your dream job
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Account created successfully! Redirecting to login...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Full Name" name="name"
              value={form.name} onChange={handleChange}
              error={!!formErrors.name} helperText={formErrors.name}
              placeholder="John Doe"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Email Address" name="email" type="email"
              value={form.email} onChange={handleChange}
              error={!!formErrors.email} helperText={formErrors.email}
              placeholder="john@example.com"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Password" name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password} onChange={handleChange}
              error={!!formErrors.password} helperText={formErrors.password}
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <TextField
              fullWidth label="Confirm Password" name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword} onChange={handleChange}
              error={!!formErrors.confirmPassword} helperText={formErrors.confirmPassword}
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading || success}
              sx={{
                py: 1.5, fontWeight: 700, borderRadius: 2,
                background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1a237e', fontWeight: 600, textDecoration: 'none' }}>
                Sign in here
              </Link>
            </Typography>
          </Box>

        </CardContent>
      </Card>
    </Box>
  )
}

export default Register