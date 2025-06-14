# create-backend-modules.ps1
# Script para crear automáticamente todos los módulos del backend:
# Clientes, Inventario, Ventas, Alertas y Control de Roles

$base = "C:\Users\famil\Desktop\Demo\pharmasys-oriental-backend\src"

$files = @{
  ### CLIENTES ###
  "api\validators\client.validator.ts" = @"
import { z } from 'zod';

export const clientValidator = {
  create: z.object({
    body: z.object({
      nombres: z.string().min(1),
      apellidos: z.string().min(1),
      dni_ruc: z.string().optional(),
      telefono: z.string().optional(),
      email: z.string().email().optional(),
      direccion_cliente: z.string().optional(),
      fecha_nacimiento: z.string().optional(),
    }),
  }),
  update: z.object({
    params: z.object({ id: z.string().regex(/^[0-9]+$/) }),
    body: z.object({
      nombres: z.string().min(1).optional(),
      apellidos: z.string().min(1).optional(),
      dni_ruc: z.string().optional(),
      telefono: z.string().optional(),
      email: z.string().email().optional(),
      direccion_cliente: z.string().optional(),
      fecha_nacimiento: z.string().optional(),
    }),
  }),
};
"@
  "services\client.service.ts" = @"
import db from '../config/database';

export async function getAllClients() {
  return db('Clientes').select('*');
}

export async function getClientById(id: number) {
  return db('Clientes').where({ id }).first();
}

export async function createClient(data: any) {
  return db('Clientes').insert(data).returning('*');
}

export async function updateClient(id: number, data: any) {
  return db('Clientes').where({ id }).update(data).returning('*');
}

export async function deleteClient(id: number) {
  return db('Clientes').where({ id }).del();
}
"@
  "api\controllers\client.controller.ts" = @"
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
"@
  "api\routes\client.routes.ts" = @"
import { Router } from 'express';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/client.controller';
import { validate } from '../middlewares/validation.middleware';
import { clientValidator } from '../validators/client.validator';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();

router.get('/',    allowRoles('Supervisor','Gerente','Admin'), getAllClients);
router.get('/:id', allowRoles('Supervisor','Gerente','Admin'), validate(clientValidator.update), getClientById);
router.post('/',   allowRoles('Supervisor','Gerente','Admin'), validate(clientValidator.create), createClient);
router.put('/:id', allowRoles('Supervisor','Gerente','Admin'), validate(clientValidator.update), updateClient);
router.delete('/:id', allowRoles('Admin'), deleteClient);

export default router;
"@

  ### INVENTARIO ###
  "api\validators\inventory.validator.ts" = @"
import { z } from 'zod';

export const inventoryValidator = {
  ingress: z.object({
    body: z.object({
      producto_id: z.number().int().positive(),
      sucursal_id: z.number().int().positive(),
      lote_numero: z.string().min(1),
      fecha_vencimiento: z.string().min(1),
      cantidad_actual: z.number().int().positive(),
    }),
  }),
  adjust: z.object({
    body: z.object({
      inventario_lote_id: z.number().int().positive(),
      cantidad_movimiento: z.number().int().optional(),
      tipo_movimiento: z.string().min(1),
      justificacion: z.string().optional(),
    }),
  }),
};
"@
  "services\inventory.service.ts" = @"
import db from '../config/database';

export async function getStockBySucursal(sucursal_id: number) {
  return db('InventarioLotes')
    .where({ sucursal_id })
    .andWhere('cantidad_actual','>',0)
    .select('*');
}

export async function ingressLot(data: any) {
  return db('InventarioLotes').insert(data).returning('*');
}

export async function adjustInventory(data: any) {
  return db.transaction(async trx => {
    await trx('MovimientosInventario').insert(data);
    await trx('InventarioLotes')
      .where({ id: data.inventario_lote_id })
      .increment('cantidad_actual', data.cantidad_movimiento);
  });
}
"@
  "api\controllers\inventory.controller.ts" = @"
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
"@
  "api\routes\inventory.routes.ts" = @"
import { Router } from 'express';
import { getStock, ingressLot, adjustInventory } from '../controllers/inventory.controller';
import { validate } from '../middlewares/validation.middleware';
import { inventoryValidator } from '../validators/inventory.validator';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();
router.get('/sucursal/:sucursalId', allowRoles('Venta','Supervisor','Gerente','Admin'), getStock);
router.post('/lotes',             allowRoles('Supervisor','Admin'), validate(inventoryValidator.ingress), ingressLot);
router.post('/ajuste',            allowRoles('Supervisor','Admin'), validate(inventoryValidator.adjust), adjustInventory);
export default router;
"@

  ### VENTAS ###
  "api\validators\sale.validator.ts" = @"
import { z } from 'zod';

export const saleValidator = {
  create: z.object({
    body: z.object({
      sucursal_id: z.number().int().positive(),
      usuario_id:  z.number().int().positive(),
      cliente_id:  z.number().int().optional(),
      items: z.array(z.object({
        inventario_lote_id: z.number().int().positive(),
        producto_id:        z.number().int().positive(),
        cantidad_vendida:   z.number().int().positive(),
        precio_unitario_venta: z.number().positive(),
        despachado_desde_sucursal_id: z.number().int().optional(),
      })),
      metodo_pago: z.string().optional(),
    }),
  }),
};
"@
  "services\sale.service.ts" = @"
import db from '../config/database';

export async function createSale(data: any) {
  return db.transaction(async trx => {
    const total = data.items.reduce((sum:any,i:any)=>sum + i.cantidad_vendida * i.precio_unitario_venta, 0);
    const [sale] = await trx('Ventas')
      .insert({ sucursal_id: data.sucursal_id, usuario_id: data.usuario_id, cliente_id: data.cliente_id, subtotal: total, descuento_total: 0, impuestos_total: 0, total_venta: total, metodo_pago: data.metodo_pago, numero_factura: `F-${Date.now()}` })
      .returning('*');

    for (const it of data.items) {
      await trx('VentaDetalles').insert({ venta_id: sale.id, inventario_lote_id: it.inventario_lote_id, producto_id: it.producto_id, cantidad_vendida: it.cantidad_vendida, precio_unitario_venta: it.precio_unitario_venta, subtotal_item: it.cantidad_vendida * it.precio_unitario_venta, despachado_desde_sucursal_id: it.despachado_desde_sucursal_id });
      await trx('InventarioLotes').where({ id: it.inventario_lote_id }).decrement('cantidad_actual', it.cantidad_vendida);
    }
    return sale;
  });
}
"@
  "api\controllers\sale.controller.ts" = @"
import { Request, Response, NextFunction } from 'express';
import * as SaleSvc from '../../services/sale.service';

export async function createSale(req: Request, res: Response, next: NextFunction) {
  try { const sale = await SaleSvc.createSale(req.body); res.status(201).json(sale); } catch (e) { next(e); }
}
"@
  "api\routes\sale.routes.ts" = @"
import { Router } from 'express';
import { createSale } from '../controllers/sale.controller';
import { validate } from '../middlewares/validation.middleware';
import { saleValidator } from '../validators/sale.validator';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();
router.post('/', allowRoles('Venta','Supervisor','Admin'), validate(saleValidator.create), createSale);
export default router;
"@

  ### ALERTAS ###
  "api\validators\alert.validator.ts" = @"
import { z } from 'zod';

export const alertValidator = {
  update: z.object({
    params: z.object({ id: z.string().regex(/^[0-9]+$/) }),
    body:   z.object({ estado_alerta: z.string().nonempty() }),
  }),
};
"@
  "services\alert.service.ts" = @"
import db from '../config/database';

export async function getAllAlerts() {
  return db('AlertasSistema').select('*');
}

export async function updateAlert(id: number, estado: string) {
  return db('AlertasSistema').where({ id }).update({ estado_alerta: estado }).returning('*');
}
"@
  "api\controllers\alert.controller.ts" = @"
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
"@
  "api\routes\alert.routes.ts" = @"
import { Router } from 'express';
import { getAllAlerts, updateAlert } from '../controllers/alert.controller';
import { validate } from '../middlewares/validation.middleware';
import { alertValidator } from '../validators/alert.validator';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();
router.get('/', allowRoles('Supervisor','Gerente','Admin'), getAllAlerts);
router.put('/:id', allowRoles('Supervisor','Gerente','Admin'), validate(alertValidator.update), updateAlert);
export default router;
"@

  ### MIDDLEWARE ROLES ###
  "api\middlewares\role.middleware.ts" = @"
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

type Role = 'Venta' | 'Supervisor' | 'Gerente' | 'Admin';

export function allowRoles(...allowed: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
    const token = auth.slice(7);
    try {
      const payload: any = jwt.verify(token, JWT_SECRET!);
      if (!allowed.includes(payload.rol as Role)) return res.status(403).json({ error: 'Rol no autorizado' });
      next();
    } catch {
      res.status(401).json({ error: 'Token inválido' });
    }
  };
}
"@
}

# Crear archivos
foreach ($path in $files.Keys) {
  $full = Join-Path $base $path
  $dir = Split-Path $full
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Set-Content -Path $full -Value $files[$path] -Encoding UTF8 -Force
  Write-Host "Creado: $path"
}

Write-Host '✅ Todos los módulos (Clientes, Inventario, Ventas, Alertas, Roles) creados.'
