import { Router } from 'express'
import * as exam from '../controllers/exam.controller.js'
import { protect } from '../middleware/auth.js'
import objectIdCheck from '../middleware/objectIdCheck.js'

const router = Router()
router.use(protect)

router.get('/', exam.getExams)
router.post('/', exam.createExam)
router.get('/:id', objectIdCheck('id'), exam.getExam)
router.put('/:id', objectIdCheck('id'), exam.updateExam)
router.delete('/:id', objectIdCheck('id'), exam.deleteExam)
router.put('/:id/syllabus/:topicId', objectIdCheck('id'), exam.toggleSyllabusTopic)

export default router
