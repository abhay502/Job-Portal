import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemText,
  Avatar, Menu, MenuItem, Divider, useMediaQuery, useTheme
} from '@mui/material'
import { Work, Menu as MenuIcon, Logout, Person } from '@mui/icons-material'
import { logout } from '../../features/auth/authSlice'

const navLinks = [
  { label: 'Home', path: '/home' },
  { label: 'Jobs', path: '/jobs' },
]

const Navbar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user, accessToken } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/home')
  }

  return (
    <>
      <AppBar position="sticky" elevation={1}
        sx={{ background: '#fff', color: '#1a237e' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>

          {/* Logo */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={() => navigate('/home')}
          >
            <Box
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
              }}
            >
              <Work sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="#1a237e">
              Job-Portal By Abhay
            </Typography>
          </Box>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  sx={{
                    fontWeight: location.pathname === link.path ? 700 : 400,
                    color: location.pathname === link.path ? '#1a237e' : '#555',
                    borderBottom: location.pathname === link.path ? '2px solid #1a237e' : 'none',
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {accessToken ? (
                <>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
                    <Avatar sx={{ bgcolor: '#1a237e', width: 34, height: 34, fontSize: 14 }}>
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem disabled>
                      <Person sx={{ mr: 1 }} fontSize="small" />
                      {user?.name || 'User'}
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <Logout sx={{ mr: 1 }} fontSize="small" />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    ml: 1, borderRadius: 2, fontWeight: 600,
                    background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  onClick={() => { navigate(link.path); setDrawerOpen(false) }}
                  selected={location.pathname === link.path}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            {accessToken ? (
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <Logout sx={{ mr: 1 }} fontSize="small" />
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem disablePadding>
                <ListItemButton onClick={() => { navigate('/login'); setDrawerOpen(false) }}>
                  <ListItemText primary="Sign In" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default Navbar