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
