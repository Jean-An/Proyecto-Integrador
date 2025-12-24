import { Request, Response } from 'express';
import { Product } from '../models'; // imports from index

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { nombre, categoria, precio, stock, marca, estado, descripcion, ubicacion } = req.body;
    // Basic validation
    if (!nombre || !categoria || !precio || !stock || !marca || !estado) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProduct = await Product.create({
      nombre,
      categoria,
      precio,
      stock,
      marca,
      estado,
      descripcion,
      ubicacion
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
