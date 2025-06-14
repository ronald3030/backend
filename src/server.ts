// --- src/server.ts ---
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Solo intentamos cargar el archivo .env si NO estamos en un entorno de producción,
// ya que en producción (como en Render) se usan las variables de entorno del dashboard.
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(process.cwd(), '.env');
  console.log('[INFO] Entorno de desarrollo detectado. Cargando variables desde .env...');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    // En desarrollo, es útil advertir si falta el .env, pero no detenemos la app
    // por si las variables se han configurado de otra manera.
    console.warn('[ADVERTENCIA] No se encontró el archivo .env para el entorno de desarrollo.');
  }
}

// Las importaciones de tu aplicación siempre van DESPUÉS de configurar dotenv.
import app from './app';
import db  from './config/database';

// Render asignará un puerto dinámicamente a través de la variable de entorno PORT.
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Verificamos la conexión con la base de datos antes de iniciar el servidor.
    await db.raw('SELECT 1');
    console.log('✅ PostgreSQL conectado correctamente.');

    app.listen(PORT, () => {
      // Usamos 0.0.0.0 para que el servidor sea accesible externamente en Render.
      console.log(`🚀 Server escuchando en http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('❌ No fue posible iniciar el servidor:', err);
    process.exit(1); // Detiene la aplicación si hay un error crítico.
  }
}

startServer();


// --- src/config/database.ts ---
import knexConstructor, { Knex } from 'knex';
import path from 'path';
import {
  DB_CLIENT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} from './env';

// Lógica inteligente para la conexión a la base de datos.
const connectionConfig = process.env.DATABASE_URL
  // Rama de Producción (Render): Usa la URL de conexión que provee Render.
  ? {
      connectionString: process.env.DATABASE_URL,
      // Render puede requerir SSL para conexiones seguras.
      ssl: { rejectUnauthorized: false }
    }
  // Rama de Desarrollo (Local): Usa las variables individuales de tu archivo .env.
  : {
      host:     DB_HOST,
      port:     DB_PORT,
      user:     DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    };

const knexConfig: Knex.Config = {
  // Usa 'pg' como cliente por defecto si DB_CLIENT no está definida.
  client: DB_CLIENT || 'pg',
  connection: connectionConfig,
  pool: { min: 2, max: 10 },
  migrations: {
    tableName: 'knex_migrations',
    // En producción, el código se ejecuta desde la carpeta 'dist/', por lo que
    // Knex debe buscar las migraciones compiladas allí.
    directory: path.resolve(__dirname, '..', 'db/migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'db/seeds')
  }
};

const db: Knex = knexConstructor(knexConfig);

export default db;


