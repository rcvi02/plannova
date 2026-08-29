import { Router } from 'express'
import * as subject from '../controllers/subject.controller.js'
import { protect } from '../middleware/auth.js'
import objectIdCheck from '../middleware/objectIdCheck.js'

const router = Router()
router.use(protect)

router.get('/', subject.getSubjects)
router.post('/', subject.createSubject)
router.get('/:id', objectIdCheck('id'), subject.getSubject)
router.put('/:id', objectIdCheck('id'), subject.updateSubject)
router.delete('/:id', objectIdCheck('id'), subject.deleteSubject)
router.put('/:id/archive', objectIdCheck('id'), subject.archiveSubject)
router.put('/:id/restore', objectIdCheck('id'), subject.restoreSubject)
router.get('/:id/stats', objectIdCheck('id'), subject.getSubjectStats)

export default router
