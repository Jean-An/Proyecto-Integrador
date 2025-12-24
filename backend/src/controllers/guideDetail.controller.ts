import { Request, Response } from 'express';
import { GuideDetail, Guide } from '../models';

export const getGuideDetails = async (req: Request, res: Response) => {
  try {
    const details = await GuideDetail.findAll({ include: [{ model: Guide, as: 'guia' }] });
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving guide details', error });
  }
};

export const createGuideDetail = async (req: Request, res: Response) => {
  try {
    const detail = await GuideDetail.create(req.body);
    res.status(201).json(detail);
  } catch (error) {
    res.status(500).json({ message: 'Error creating guide detail', error });
  }
};

export const updateGuideDetail = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const detail = await GuideDetail.findByPk(id);
        if (!detail) return res.status(404).json({ message: 'Guide Detail not found' });
        await detail.update(req.body);
        res.json(detail);
    } catch (error) {
        res.status(500).json({ message: 'Error updating guide detail', error });
    }
}

export const deleteGuideDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const detail = await GuideDetail.findByPk(id);
    if (!detail) return res.status(404).json({ message: 'Guide Detail not found' });
    await detail.destroy();
    res.json({ message: 'Guide Detail deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting guide detail', error });
  }
};
