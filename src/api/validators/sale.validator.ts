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
