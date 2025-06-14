import { Request, Response, NextFunction } from 'express';
import {
  loginUser,
  refreshToken as performRefresh
} from '../../services/auth.service';
import { verifyToken } from '../../utils/auth.helpers';
import { JWT_SECRET } from '../../config/env';
import db from '../../config/database';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { accessToken, refreshToken, user } = await loginUser(req.body);
    
    // Devolver información completa para el frontend
    res.json({
      success: true,
      message: 'Login exitoso',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
        nombre_completo: user.nombre_completo,
        email: user.email,
        rol_id: user.rol_id,
        rol: user.rol,
        // Información adicional para el frontend
        dashboard_url: getDashboardUrl(user.rol)
      }
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err instanceof Error ? err.message : 'Error de autenticación'
    });
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const newAccessToken = await performRefresh(req.body.token);
    res.json({ 
      success: true,
      accessToken: newAccessToken 
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err instanceof Error ? err.message : 'Refresh token inválido'
    });
  }
}

// Nuevo endpoint para verificar el usuario autenticado
export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token no proporcionado' 
      });
    }

    const token = auth.slice(7);
    const payload: any = verifyToken(token, JWT_SECRET);
    
    if (!payload) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }

    // Obtener información actualizada del usuario
    const user = await db('Usuarios')
      .join('Roles', 'Usuarios.rol_id', 'Roles.id')
      .select(
        'Usuarios.id',
        'Usuarios.nombre_usuario',
        'Usuarios.nombre_completo',
        'Usuarios.email',
        'Usuarios.rol_id',
        'Roles.nombre_rol'
      )
      .where('Usuarios.id', payload.userId)
      .first();

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
        nombre_completo: user.nombre_completo,
        email: user.email,
        rol_id: user.rol_id,
        rol: user.nombre_rol,
        dashboard_url: getDashboardUrl(user.nombre_rol)
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
}

// Función helper para determinar la URL del dashboard según el rol
function getDashboardUrl(rol: string): string {
  switch (rol) {
    case 'Admin':
      return '/dashboard/admin';
    case 'Gerente':
      return '/dashboard/gerente';
    case 'Supervisor':
      return '/dashboard/supervisor';
    case 'Venta':
      return '/dashboard/venta';
    default:
      return '/dashboard';
  }
}

