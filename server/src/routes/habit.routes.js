import { Router } from 'express'
import * as habit from '../controllers/habit.controller.js'
import { protect } from '../middleware/auth.js'
import objectIdCheck from '../middleware/objectIdCheck.js'

const router = Router()
router.use(protect)

router.get('/', habit.getHabits)
router.post('/', habit.createHabit)
router.get('/:id', objectIdCheck('id'), habit.getHabit)
router.put('/:id', objectIdCheck('id'), habit.updateHabit)
router.delete('/:id', objectIdCheck('id'), habit.deleteHabit)
router.post('/:id/toggle', objectIdCheck('id'), habit.toggleHabitToday)

export default router
