import { Router } from 'express';
import { getEntryGuides, createEntryGuide, updateEntryGuide, deleteEntryGuide } from '../controllers/entryGuide.controller';

const router = Router();

router.get('/', getEntryGuides);
router.post('/', createEntryGuide);
router.put('/:id', updateEntryGuide);
router.delete('/:id', deleteEntryGuide);

export default router;
