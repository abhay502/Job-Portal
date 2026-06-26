import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CircularProgress, Box } from '@mui/material'

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, accessToken, initialized } = useSelector((state) => state.auth)

  if (!initialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!accessToken) {
    return <Navigate to={allowedRole === 'admin' ? '/admin/login' : '/login'} replace />
  }

  if (allowedRole === 'admin' && user?.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute