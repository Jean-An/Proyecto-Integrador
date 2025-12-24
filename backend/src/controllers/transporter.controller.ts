import { Request, Response } from 'express';
import { Transporter } from '../models';

export const getTransporters = async (req: Request, res: Response) => {
  try {
    const transporters = await Transporter.findAll();
    res.json(transporters);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transporters', error });
  }
};

export const createTransporter = async (req: Request, res: Response) => {
  try {
    const transporter = await Transporter.create(req.body);
    res.status(201).json(transporter);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transporter', error });
  }
};

export const updateTransporter = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const transporter = await Transporter.findByPk(id);
    if (!transporter) return res.status(404).json({ message: 'Transporter not found' });
    await transporter.update(req.body);
    res.json(transporter);
  } catch (error) {
    res.status(500).json({ message: 'Error updating transporter', error });
  }
};

export const deleteTransporter = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const transporter = await Transporter.findByPk(id);
    if (!transporter) return res.status(404).json({ message: 'Transporter not found' });
    await transporter.destroy();
    res.json({ message: 'Transporter deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transporter', error });
  }
};
