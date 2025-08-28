import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/notes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router();
router.use(authMiddleware);
router.get('/', getNotes);
router.post('/', createNote);
router.delete('/:id', deleteNote);
export default router;
