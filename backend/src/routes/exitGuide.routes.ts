import { Router } from 'express';
import { getExitGuides, createExitGuide, updateExitGuide, deleteExitGuide } from '../controllers/exitGuide.controller';

const router = Router();

router.get('/', getExitGuides);
router.post('/', createExitGuide);
router.put('/:id', updateExitGuide);
router.delete('/:id', deleteExitGuide);

export default router;
