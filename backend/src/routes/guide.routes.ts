import { Router } from 'express';
import { getGuides, createGuide, updateGuide, deleteGuide } from '../controllers/guide.controller';

const router = Router();

router.get('/', getGuides);
router.post('/', createGuide);
router.put('/:id', updateGuide);
router.delete('/:id', deleteGuide);

export default router;
