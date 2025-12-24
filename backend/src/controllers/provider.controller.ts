import { Request, Response } from 'express';
import { Provider } from '../models';

export const getProviders = async (req: Request, res: Response) => {
  try {
    const providers = await Provider.findAll();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving providers', error });
  }
};

export const createProvider = async (req: Request, res: Response) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Error creating provider', error });
  }
};

export const updateProvider = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const provider = await Provider.findByPk(id);
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        await provider.update(req.body);
        res.json(provider);
    } catch (error) {
        res.status(500).json({ message: 'Error updating provider', error });
    }
}

export const deleteProvider = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const provider = await Provider.findByPk(id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    await provider.destroy();
    res.json({ message: 'Provider deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting provider', error });
  }
};
