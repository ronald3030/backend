// src/server.ts
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs'; // Importamos 'fs' para verificar si el archivo existe

// ---- INICIO DE LA SOLUCIÓN REFORZADA V2 ----

const envPath = path.resolve(process.cwd(), '.env');

// 1. (Depuración) Mostramos la ruta exacta que estamos intentando leer.
console.log(`[DEBUG] Buscando archivo .env en: ${envPath}`);

// 2. Verificamos si el archivo .env existe FÍSICAMENTE en esa ruta.
if (!fs.existsSync(envPath)) {
  console.error(`Error Crítico: No se encontró el archivo .env en la ruta esperada.`);
  console.error("Asegúrate de que el archivo .env esté en la raíz del proyecto, al mismo nivel que package.json.");
  process.exit(1);
}

// 3. Si existe, cargamos las variables de entorno.
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Error Crítico: El archivo .env existe pero no se pudo procesar.", result.error);
  process.exit(1);
}

// 4. (Depuración) Confirmamos el valor cargado.
console.log(`[DEBUG] Valor de DB_CLIENT cargado: ${process.env.DB_CLIENT}`);
if (!process.env.DB_CLIENT) {
    console.warn("[ADVERTENCIA] DB_CLIENT se cargó como undefined. Revisa que la variable esté definida dentro de tu archivo .env.");
}

// ---- FIN DE LA SOLUCIÓN REFORZADA V2 ----


// Las importaciones de tu aplicación deben ir SIEMPRE DESPUÉS de cargar dotenv.
import app from './app';
import db  from './config/database';

const PORT = parseInt(process.env.PORT || '3001', 10);

async function startServer() {
  try {
    await db.raw('SELECT 1');
    console.log('✅ PostgreSQL conectado correctamente.');
    app.listen(PORT, () =>
      console.log(`🚀 Server http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ No fue posible iniciar el servidor:', err);
    process.exit(1);
  }
}

startServer();



