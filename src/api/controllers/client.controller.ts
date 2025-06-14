import { Request, Response, NextFunction } from 'express';
import * as ClientSvc from '../../services/client.service';

export async function getAllClients(req: Request, res: Response, next: NextFunction) {
  try { const clients = await ClientSvc.getAllClients(); res.json(clients); } catch (e) { next(e); }
}

export async function getClientById(req: Request, res: Response, next: NextFunction) {
  try { const client = await ClientSvc.getClientById(+req.params.id);
    if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(client);
  } catch (e) { next(e); }
}

export async function createClient(req: Request, res: Response, next: NextFunction) {
  try {
    const [newClient] = await ClientSvc.createClient(req.body);
    res.status(201).json(newClient);
  } catch (e) { next(e); }
}

export async function updateClient(req: Request, res: Response, next: NextFunction) {
  try {
    const [updated] = await ClientSvc.updateClient(+req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(updated);
  } catch (e) { next(e); }
}

export async function deleteClient(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await ClientSvc.deleteClient(+req.params.id);
    if (!count) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.status(204).send();
  } catch (e) { next(e); }
}
