import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials, logout, setInitialized } from '../features/auth/authSlice'
import { getMe, refreshAccessToken } from '../services/authService'

const useAuthInit = () => {
  const dispatch = useDispatch()
  const accessToken = useSelector((state) => state.auth.accessToken)

  useEffect(() => {
    const initAuth = async () => {
      // No in-memory token (e.g. fresh page load) — this is the normal case, NOT a "logged out" signal.
      // Try to exchange the httpOnly refreshToken cookie for a new accessToken.
      if (!accessToken) {
        try {
          const res = await refreshAccessToken() // POST /auth/refresh-token, withCredentials: true, no body
          dispatch(setCredentials({
            user: res.data.user,
            accessToken: res.data.accessToken,
          }))
        } catch {
          // No valid refresh cookie — genuinely logged out. Not an error to surface to the user.
          dispatch(logout())
        } finally {
          dispatch(setInitialized())
        }
        return
      }

      // We already have an accessToken in memory (e.g. this hook re-ran without a full reload) —
      // just confirm it's still valid and refresh the user object.
      try {
        const res = await getMe()
        dispatch(setCredentials({
          user: res.data.user,
          accessToken,
        }))
      } catch {
        dispatch(logout())
      } finally {
        dispatch(setInitialized())
      }
    }
    initAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- intentionally run once on mount only
}

export default useAuthInit