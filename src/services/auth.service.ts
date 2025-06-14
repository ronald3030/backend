// src/services/auth.service.ts
import db from '../config/database';
import { comparePassword, generateAccessToken, generateRefreshToken, verifyToken } from '../utils/auth.helpers';
import { JWT_REFRESH_SECRET } from '../config/env';

interface LoginParams {
  nombre_usuario: string;
  password: string;
}

export async function loginUser({ nombre_usuario, password }: LoginParams) {
  // Buscar usuario con información completa incluyendo el rol
  const user = await db('Usuarios')
    .join('Roles', 'Usuarios.rol_id', 'Roles.id')
    .select(
      'Usuarios.id',
      'Usuarios.nombre_usuario',
      'Usuarios.nombre_completo',
      'Usuarios.email',
      'Usuarios.password_hash',
      'Usuarios.rol_id',
      'Roles.nombre_rol'
    )
    .where('Usuarios.nombre_usuario', nombre_usuario)
    .first();

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    throw new Error('Contraseña incorrecta');
  }

  // Generar tokens
  const accessToken = generateAccessToken(user.id, user.nombre_rol);
  const refreshToken = generateRefreshToken(user.id);

  // Devolver información completa del usuario (sin la contraseña)
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      nombre_usuario: user.nombre_usuario,
      nombre_completo: user.nombre_completo,
      email: user.email,
      rol_id: user.rol_id,
      rol: user.nombre_rol,
    }
  };
}

export async function refreshToken(token: string) {
  const payload: any = verifyToken(token, JWT_REFRESH_SECRET as any);
  if (!payload || !payload.userId) {
    throw new Error('Refresh token inválido');
  }

  // Buscar usuario actualizado para generar nuevo token
  const user = await db('Usuarios')
    .join('Roles', 'Usuarios.rol_id', 'Roles.id')
    .select('Usuarios.id', 'Roles.nombre_rol')
    .where('Usuarios.id', payload.userId)
    .first();

  if (!user) {
    throw new Error('Usuario no encontrado para refresh');
  }

  return generateAccessToken(user.id, user.nombre_rol);
}
