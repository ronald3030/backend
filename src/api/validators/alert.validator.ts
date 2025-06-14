import { z } from 'zod';

export const alertValidator = {
  update: z.object({
    params: z.object({ id: z.string().regex(/^[0-9]+$/) }),
    body:   z.object({ estado_alerta: z.string().nonempty() }),
  }),
};
