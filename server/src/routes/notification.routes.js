import { Router } from 'express'
import * as notif from '../controllers/notification.controller.js'
import { protect } from '../middleware/auth.js'
import objectIdCheck from '../middleware/objectIdCheck.js'

const router = Router()
router.use(protect)

router.get('/', notif.getNotifications)
router.put('/read-all', notif.markAllRead)
router.put('/:id/read', objectIdCheck('id'), notif.markRead)
router.delete('/:id', objectIdCheck('id'), notif.deleteNotification)

export default router
