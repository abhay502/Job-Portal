import { Router } from 'express'
import {
  applyForJob, getMyApplications, getAllApplications
} from '../controllers/applicationController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.post('/jobs/:id/apply', protect, applyForJob)
router.get('/me', protect, getMyApplications)
router.get('/', protect, adminOnly, getAllApplications)

export default router