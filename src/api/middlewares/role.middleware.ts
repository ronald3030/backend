// src/api/middlewares/role.middleware.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/env';  // <-- dos niveles arriba

type Role = 'Venta' | 'Supervisor' | 'Gerente' | 'Admin';

export function allowRoles(...allowed: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token' });
    }
    const token = auth.slice(7);
    try {
      const payload: any = jwt.verify(token, JWT_SECRET!);
      const userRole: Role = payload.rol;
      if (!allowed.includes(userRole)) {
        return res.status(403).json({ error: 'Rol no autorizado' });
      }
      next();
    } catch {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
}


