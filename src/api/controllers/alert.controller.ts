import { Request, Response, NextFunction } from 'express';
import * as AlertSvc from '../../services/alert.service';

export async function getAllAlerts(req: Request, res: Response, next: NextFunction) {
  try { const alerts = await AlertSvc.getAllAlerts(); res.json(alerts); } catch (e) { next(e); }
}

export async function updateAlert(req: Request, res: Response, next: NextFunction) {
  try {
    const [updated] = await AlertSvc.updateAlert(+req.params.id, req.body.estado_alerta);
    if (!updated) return res.status(404).json({ error: 'Alerta no encontrada' });
    res.json(updated);
  } catch (e) { next(e); }
}
