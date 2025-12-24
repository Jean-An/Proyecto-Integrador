import { Request, Response } from 'express';
import { ExitGuide, Guide } from '../models';

export const getExitGuides = async (req: Request, res: Response) => {
  try {
    const exitGuides = await ExitGuide.findAll({ include: [{ model: Guide, as: 'guia' }] });
    res.json(exitGuides);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving exit guides', error });
  }
};

export const createExitGuide = async (req: Request, res: Response) => {
  try {
    const exitGuide = await ExitGuide.create(req.body);
    res.status(201).json(exitGuide);
  } catch (error) {
    res.status(500).json({ message: 'Error creating exit guide', error });
  }
};

export const updateExitGuide = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const exitGuide = await ExitGuide.findByPk(id);
        if (!exitGuide) return res.status(404).json({ message: 'Exit Guide not found' });
        await exitGuide.update(req.body);
        res.json(exitGuide);
    } catch (error) {
        res.status(500).json({ message: 'Error updating exit guide', error });
    }
}

export const deleteExitGuide = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exitGuide = await ExitGuide.findByPk(id);
    if (!exitGuide) return res.status(404).json({ message: 'Exit Guide not found' });
    await exitGuide.destroy();
    res.json({ message: 'Exit Guide deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exit guide', error });
  }
};
