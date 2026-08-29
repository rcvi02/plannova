import { Router } from 'express'
import * as auth from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import {
  registerSchema, loginSchema, updateProfileSchema,
  changePasswordSchema, forgotPasswordSchema, resetPasswordSchema,
} from '../validators/auth.validator.js'

const router = Router()

router.post('/register', authLimiter, validate(registerSchema), auth.register)
router.post('/login', authLimiter, validate(loginSchema), auth.login)
router.post('/google', authLimiter, auth.googleLogin)
router.post('/logout', protect, auth.logout)
router.get('/me', protect, auth.getMe)
router.put('/profile', protect, validate(updateProfileSchema), auth.updateProfile)
router.post('/change-password', protect, validate(changePasswordSchema), auth.changePassword)
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), auth.forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), auth.resetPassword)
router.post('/verify-email/:token', auth.verifyEmail)
router.delete('/account', protect, auth.deleteAccount)

export default router
