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
