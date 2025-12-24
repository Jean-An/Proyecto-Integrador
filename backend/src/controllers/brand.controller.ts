import { Request, Response } from 'express';
import { Brand } from '../models';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving brands', error });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newBrand = await Brand.create({ nombre });
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(500).json({ message: 'Error creating brand', error });
  }
};
