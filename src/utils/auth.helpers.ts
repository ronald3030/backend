// src/utils/auth.helpers.ts
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN
} from '../config/env';

/**
 * Hashea una contraseña
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compara contraseña cleartext con hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Genera un JWT de acceso
 */
export const generateAccessToken = (userId: number, rol: string): string => {
  const opts: SignOptions = {
    // JWT_EXPIRES_IN viene como string general, casteamos a any para evitar el error de tipos
    expiresIn: (JWT_EXPIRES_IN as any) || '1h'
  };
  return jwt.sign({ userId, rol }, JWT_SECRET, opts);
};

/**
 * Genera un JWT de refresh
 */
export const generateRefreshToken = (userId: number): string => {
  const opts: SignOptions = {
    expiresIn: (JWT_REFRESH_EXPIRES_IN as any) || '7d'
  };
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, opts);
};

/**
 * Verifica un token (access o refresh) y devuelve el payload
 */
export const verifyToken = (token: string, secret: string): JwtPayload | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
};

