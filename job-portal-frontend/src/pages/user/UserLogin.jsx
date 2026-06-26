import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button,
  Typography, InputAdornment, IconButton, Alert,
  CircularProgress, Divider
} from '@mui/material'
import { Visibility, VisibilityOff, Work } from '@mui/icons-material'
import { setCredentials, setLoading, setError } from '../../features/auth/authSlice'
import { loginUser } from '../../services/authService'

const UserLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const validate = () => {
    const errors = {}
    if (!form.email) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email'
    if (!form.password) errors.password = 'Password is required'
    else if (form.password.length < 6) errors.password = 'Minimum 6 characters'
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

    dispatch(setLoading(true))
    dispatch(setError(null))
    try {
      const res = await loginUser(form)
      dispatch(setCredentials(res.data))
      navigate('/home')
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Login failed'))
    } finally {
      dispatch(setLoading(false))
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
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440, borderRadius: 3, boxShadow: 10 }}>
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
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Sign in to find your dream job
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email Address" name="email" type="email"
              value={form.email} onChange={handleChange}
              error={!!formErrors.email} helperText={formErrors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Password" name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password} onChange={handleChange}
              error={!!formErrors.password} helperText={formErrors.password}
              sx={{ mb: 3 }}
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
            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              sx={{
                py: 1.5, fontWeight: 700, borderRadius: 2,
                background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1a237e', fontWeight: 600, textDecoration: 'none' }}>
                Register here
              </Link>
            </Typography>
          </Box>

        </CardContent>
      </Card>
    </Box>
  )
}

export default UserLogin