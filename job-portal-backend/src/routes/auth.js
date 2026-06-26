import { Router } from 'express'
import {
  registerUser, loginUser, loginAdmin,
  refreshToken, logoutUser,getMe
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/user/register', registerUser)
router.post('/user/login', loginUser)
router.post('/admin/login', loginAdmin)
router.post('/refresh-token', refreshToken)
router.post('/logout', protect, logoutUser)
router.get('/me', protect, getMe)

export default router