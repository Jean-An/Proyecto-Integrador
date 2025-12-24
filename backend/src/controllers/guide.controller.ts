import { Request, Response } from 'express';
import { Guide, GuideDetail, EntryGuide, ExitGuide } from '../models';

export const getGuides = async (req: Request, res: Response) => {
  try {
    const guides = await Guide.findAll({
      include: [
        { model: GuideDetail, as: 'detalles' },
        { model: EntryGuide, as: 'ingreso' },
        { model: ExitGuide, as: 'salida' }
      ]
    });
    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving guides', error });
  }
};

export const createGuide = async (req: Request, res: Response) => {
  try {
    const guide = await Guide.create(req.body);
    res.status(201).json(guide);
  } catch (error) {
    res.status(500).json({ message: 'Error creating guide', error });
  }
};

export const updateGuide = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
     const guide = await Guide.findByPk(id);
     if (!guide) return res.status(404).json({ message: 'Guide not found' });
     await guide.update(req.body);
     res.json(guide);
  } catch (error) {
      res.status(500).json({ message: 'Error updating guide', error });
  }
}

export const deleteGuide = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const guide = await Guide.findByPk(id);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    await guide.destroy();
    res.json({ message: 'Guide deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting guide', error });
  }
};
