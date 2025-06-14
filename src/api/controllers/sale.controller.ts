import { Request, Response, NextFunction } from 'express';
import * as SaleSvc from '../../services/sale.service';

export async function createSale(req: Request, res: Response, next: NextFunction) {
  try { const sale = await SaleSvc.createSale(req.body); res.status(201).json(sale); } catch (e) { next(e); }
}
