// --- src/server.ts ---
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Solo intentamos cargar el archivo .env si NO estamos en un entorno de producción,
// ya que en producción (como en Render) se usan las variables de entorno del dashboard.
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(process.cwd(), '.env');
  console.log('[INFO] Entorno de desarrollo detectado. Cargando variables desde .env...');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.warn('[ADVERTENCIA] No se encontró el archivo .env para el entorno de desarrollo.');
  }
}

// Las importaciones de tu aplicación siempre van DESPUÉS de configurar dotenv.
import app from './app';
import db from './config/database';

// Render asignará un puerto dinámicamente a través de la variable de entorno PORT.
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await db.raw('SELECT 1');
    console.log('✅ PostgreSQL conectado correctamente.');

    app.listen(PORT, () => {
      console.log(`🚀 Server escuchando en http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('❌ No fue posible iniciar el servidor:', err);
    process.exit(1);
  }
}

startServer();
