import { Router } from 'express'
import * as note from '../controllers/note.controller.js'
import { protect } from '../middleware/auth.js'
import objectIdCheck from '../middleware/objectIdCheck.js'

const router = Router()
router.use(protect)

router.get('/', note.getNotes)
router.post('/', note.createNote)
router.get('/:id', objectIdCheck('id'), note.getNote)
router.put('/:id', objectIdCheck('id'), note.updateNote)
router.delete('/:id', objectIdCheck('id'), note.deleteNote)
router.put('/:id/pin', objectIdCheck('id'), note.togglePin)
router.put('/:id/favorite', objectIdCheck('id'), note.toggleFavorite)

export default router
