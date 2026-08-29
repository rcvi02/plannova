import { Router } from 'express'
import * as session from '../controllers/session.controller.js'
import { protect } from '../middleware/auth.js'
import objectIdCheck from '../middleware/objectIdCheck.js'

const router = Router()
router.use(protect)

router.get('/', session.getSessions)
router.get('/stats', session.getSessionStats)
router.post('/', session.createSession)
router.put('/:id', objectIdCheck('id'), session.updateSession)
router.delete('/:id', objectIdCheck('id'), session.deleteSession)

export default router
