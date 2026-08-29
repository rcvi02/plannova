import { Router } from 'express'
import * as goal from '../controllers/goal.controller.js'
import { protect } from '../middleware/auth.js'
import objectIdCheck from '../middleware/objectIdCheck.js'

const router = Router()
router.use(protect)

router.get('/', goal.getGoals)
router.post('/', goal.createGoal)
router.get('/:id', objectIdCheck('id'), goal.getGoal)
router.put('/:id', objectIdCheck('id'), goal.updateGoal)
router.delete('/:id', objectIdCheck('id'), goal.deleteGoal)
router.put('/:id/progress', objectIdCheck('id'), goal.updateGoalProgress)

export default router
