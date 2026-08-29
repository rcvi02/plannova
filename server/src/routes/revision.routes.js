import { Router } from 'express'
import * as revision from '../controllers/revision.controller.js'
import { protect } from '../middleware/auth.js'
import objectIdCheck from '../middleware/objectIdCheck.js'

const router = Router()
router.use(protect)

router.get('/', revision.getRevisions)
router.post('/', revision.createRevision)
router.put('/:id/complete', objectIdCheck('id'), revision.completeRevision)
router.put('/:id/reschedule', objectIdCheck('id'), revision.rescheduleRevision)
router.delete('/:id', objectIdCheck('id'), revision.deleteRevision)

export default router
