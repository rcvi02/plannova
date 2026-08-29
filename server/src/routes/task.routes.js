import { Router } from 'express'
import * as task from '../controllers/task.controller.js'
import { protect } from '../middleware/auth.js'
import objectIdCheck from '../middleware/objectIdCheck.js'

const router = Router()
router.use(protect)

router.get('/', task.getTasks)
router.get('/today', task.getTodayTasks)
router.post('/bulk', task.bulkAction)
router.post('/', task.createTask)
router.get('/:id', objectIdCheck('id'), task.getTask)
router.put('/:id', objectIdCheck('id'), task.updateTask)
router.delete('/:id', objectIdCheck('id'), task.deleteTask)
router.put('/:id/toggle', objectIdCheck('id'), task.toggleTask)
router.put('/:id/reschedule', objectIdCheck('id'), task.rescheduleTask)

export default router
