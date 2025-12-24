import { Router } from 'express';
import { getGuideDetails, createGuideDetail, updateGuideDetail, deleteGuideDetail } from '../controllers/guideDetail.controller';

const router = Router();

router.get('/', getGuideDetails);
router.post('/', createGuideDetail);
router.put('/:id', updateGuideDetail);
router.delete('/:id', deleteGuideDetail);

export default router;
