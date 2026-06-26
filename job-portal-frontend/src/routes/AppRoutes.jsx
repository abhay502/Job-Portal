import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout from '../components/admin/AdminLayout'
import UserLayout from '../components/user/UserLayout'

// Auth Pages
import AdminLogin from '../pages/admin/AdminLogin'
import UserLogin from '../pages/user/UserLogin'

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminJobList from '../pages/admin/AdminJobList'
import AdminJobForm from '../pages/admin/AdminJobForm'

// User Pages
import Home from '../pages/user/Home'
import JobListing from '../pages/user/JobListing'
import JobDetails from '../pages/user/JobDetails'
import Register from '../pages/user/Register'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* User Routes with Layout */}
        <Route element={<UserLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/jobs" element={<JobListing />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobList />} />
          <Route path="jobs/new" element={<AdminJobForm />} />
          <Route path="jobs/edit/:id" element={<AdminJobForm />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/home" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes