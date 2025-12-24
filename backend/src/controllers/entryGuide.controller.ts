import { Request, Response } from 'express';
import { EntryGuide, Guide } from '../models';

export const getEntryGuides = async (req: Request, res: Response) => {
  try {
    const entryGuides = await EntryGuide.findAll({ include: [{ model: Guide, as: 'guia' }] });
    res.json(entryGuides);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving entry guides', error });
  }
};

export const createEntryGuide = async (req: Request, res: Response) => {
  try {
    const entryGuide = await EntryGuide.create(req.body);
    res.status(201).json(entryGuide);
  } catch (error) {
    res.status(500).json({ message: 'Error creating entry guide', error });
  }
};

export const updateEntryGuide = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const entryGuide = await EntryGuide.findByPk(id);
        if (!entryGuide) return res.status(404).json({ message: 'Entry Guide not found' });
        await entryGuide.update(req.body);
        res.json(entryGuide);
    } catch (error) {
        res.status(500).json({ message: 'Error updating entry guide', error });
    }
}

export const deleteEntryGuide = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const entryGuide = await EntryGuide.findByPk(id);
    if (!entryGuide) return res.status(404).json({ message: 'Entry Guide not found' });
    await entryGuide.destroy();
    res.json({ message: 'Entry Guide deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry guide', error });
  }
};
