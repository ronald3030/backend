import { z } from 'zod';

export const loginValidator = z.object({
  body: z.object({
    nombre_usuario: z.string().nonempty(),
    password:       z.string().nonempty(),
  }),
});

export const refreshValidator = z.object({
  body: z.object({
    token: z.string().nonempty(),
  }),
});
