// src/config/env.ts

// Base de datos
export const DB_CLIENT   = process.env.DB_CLIENT!;
export const DB_HOST     = process.env.DB_HOST!;
export const DB_PORT     = Number(process.env.DB_PORT!); // Correctamente convertido a número
export const DB_USER     = process.env.DB_USER!;
export const DB_PASSWORD = process.env.DB_PASSWORD!;
export const DB_NAME     = process.env.DB_NAME!;

// JWT
export const JWT_SECRET            = process.env.JWT_SECRET!;
export const JWT_EXPIRES_IN        = process.env.JWT_EXPIRES_IN!;
export const JWT_REFRESH_SECRET    = process.env.JWT_REFRESH_SECRET!;
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN!;



