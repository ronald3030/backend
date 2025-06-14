import { z } from 'zod';

export const productValidator = {
  create: z.object({
    body: z.object({
      nombre_producto:       z.string().min(1),
      precio_venta_sugerido: z.number().positive(),
      categoria_id:          z.number().int().positive(),
    }),
  }),
  update: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9]+$/),
    }),
    body: z.object({
      nombre_producto:       z.string().min(1).optional(),
      precio_venta_sugerido: z.number().positive().optional(),
      categoria_id:          z.number().int().positive().optional(),
    }),
  }),
};
