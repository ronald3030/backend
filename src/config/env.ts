// src/config/env.ts

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Faltante la variable de entorno requerida: ${name}`);
  }
  return value;
}

function requireEnvNumber(name: string): number {
  const value = process.env[name];
  if (!value || isNaN(Number(value))) {
    throw new Error(`❌ La variable ${name} debe ser un número válido`);
  }
  return Number(value);
}

// Base de datos
export const DB_CLIENT    = requireEnv('DB_CLIENT');
export const DB_HOST      = requireEnv('DB_HOST');
export const DB_PORT      = requireEnvNumber('DB_PORT');
export const DB_USER      = requireEnv('DB_USER');
export const DB_PASSWORD  = requireEnv('DB_PASSWORD');
export const DB_NAME      = requireEnv('DB_NAME');

// JWT
export const JWT_SECRET             = requireEnv('JWT_SECRET');
export const JWT_EXPIRES_IN         = requireEnv('JWT_EXPIRES_IN');
export const JWT_REFRESH_SECRET     = requireEnv('JWT_REFRESH_SECRET');
export const JWT_REFRESH_EXPIRES_IN = requireEnv('JWT_REFRESH_EXPIRES_IN');
