import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body:   req.body,
        params: req.params,
        query:  req.query,
      });
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      return next(err);
    }
  };
}

