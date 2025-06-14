// RUTA EXACTA: src/types/custom.d.ts
// Este archivo define tipos y interfaces personalizados para usar en todo el proyecto.
// El sufijo '.d.ts' indica que es un archivo de declaración de tipos.

// Define una interfaz para el objeto de usuario que obtenemos de la base de datos,
// incluyendo los datos del JOIN con la tabla Roles.
export interface DBUser {
    id: number;
    nombre_usuario: string;
    password_hash: string;
    rol_id: number;
    sucursal_id: number | null;
    activo: boolean;
    nombre_rol?: string; // El '?' indica que es opcional, pero nuestro JOIN siempre lo traerá.
}


// Esta es una técnica avanzada y muy útil en Express con TypeScript.
// Le decimos a TypeScript que el objeto `Request` de Express puede tener una
// propiedad opcional `user`, donde guardaremos la información del usuario
// autenticado después de verificar su token JWT.
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                rol: string;
            };
        }
    }
}

// Este export vacío es a veces necesario para asegurar que el archivo sea tratado
// como un módulo por TypeScript, especialmente en archivos '.d.ts'.
export {};