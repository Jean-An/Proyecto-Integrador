import { Request, Response } from 'express';
import { Client } from '../models';

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving clients', error });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.create(req.body); // Validate body?
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error creating client', error });
  }
};

export const updateClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const client = await Client.findByPk(id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        await client.update(req.body);
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error });
    }
}

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    await client.destroy();
    res.json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting client', error });
  }
};
