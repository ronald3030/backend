import { Request, Response, NextFunction } from 'express';
import * as InvSvc from '../../services/inventory.service';

export async function getStock(req: Request, res: Response, next: NextFunction) {
  try { const stock = await InvSvc.getStockBySucursal(+req.params.sucursalId); res.json(stock); } catch (e) { next(e); }
}

export async function ingressLot(req: Request, res: Response, next: NextFunction) {
  try { const [lot] = await InvSvc.ingressLot(req.body); res.status(201).json(lot); } catch (e) { next(e); }
}

export async function adjustInventory(req: Request, res: Response, next: NextFunction) {
  try { await InvSvc.adjustInventory(req.body); res.status(204).send(); } catch (e) { next(e); }
}
