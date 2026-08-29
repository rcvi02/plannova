import { Router } from 'express'
import { getDashboard } from '../controllers/dashboard.controller.js'
import { getAnalytics } from '../controllers/analytics.controller.js'
import { globalSearch } from '../controllers/search.controller.js'
import { uploadProfileImage, uploadNoteAttachment } from '../controllers/upload.controller.js'
import { uploadProfileImage as uploadProfileMiddleware, uploadNoteAttachment as uploadAttachmentMiddleware } from '../middleware/upload.js'
import { protect } from '../middleware/auth.js'
import { uploadLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.get('/dashboard', protect, getDashboard)
router.get('/analytics', protect, getAnalytics)
router.get('/search', protect, globalSearch)
router.post('/uploads/profile', protect, uploadLimiter, uploadProfileMiddleware, uploadProfileImage)
router.post('/uploads/note-attachment', protect, uploadLimiter, uploadAttachmentMiddleware, uploadNoteAttachment)

export default router
