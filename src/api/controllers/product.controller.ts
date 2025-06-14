import { Request, Response, NextFunction } from 'express';
import db from '../../config/database';

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await db('Productos').select('*');
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const product = await db('Productos').where({ id }).first();
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const [newProduct] = await db('Productos')
      .insert(req.body)
      .returning('*');
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updated = await db('Productos')
      .where({ id })
      .update(req.body)
      .returning('*');
    if (!updated.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const count = await db('Productos').where({ id }).del();
    if (!count) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
