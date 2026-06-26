import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials, logout, setInitialized } from '../features/auth/authSlice'
import { getMe } from '../services/authService'

const useAuthInit = () => {
  const dispatch = useDispatch()
  const { accessToken } = useSelector((state) => state.auth)

  useEffect(() => {
    const initAuth = async () => {
      if (!accessToken) {
        dispatch(setInitialized())
        return
      }
      try {
        const res = await getMe()
        dispatch(setCredentials({
          user: res.data.user,
          accessToken,
          refreshToken: localStorage.getItem('refreshToken'),
        }))
      } catch {
        dispatch(logout())
      } finally {
        dispatch(setInitialized())
      }
    }
    initAuth()
  }, [])
}

export default useAuthInit