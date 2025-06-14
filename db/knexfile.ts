// knexfile.ts
import dotenv from 'dotenv';
import path from 'path'; // Para construir la ruta al .env de forma más robusta

// Carga las variables de entorno desde el archivo .env en la raíz del proyecto
// __dirname se refiere al directorio actual del archivo (donde está knexfile.ts)
// Asumimos que .env está un nivel arriba si knexfile está en src/db o similar,
// o en el mismo nivel si knexfile está en la raíz.
// Si tu knexfile.ts está en la raíz del proyecto backend, esto es suficiente:
dotenv.config();
// Si tu knexfile.ts está en una subcarpeta como 'src/db/', usa:
// dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Ajusta '../..' según sea necesario

import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CLIENT || 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10), // Asegura que sea un número
      user: process.env.DB_USER, // Tomado de .env
      password: process.env.DB_PASSWORD, // Tomado de .env
      database: process.env.DB_NAME, // Tomado de .env
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/db/migrations' // Asegúrate que este directorio exista o créalo
    },
    seeds: {
      directory: './src/db/seeds' // Asegúrate que este directorio exista o créalo
    }
  },

  // Puedes añadir configuraciones para 'staging' y 'production' aquí
  // production: {
  //   client: process.env.DB_CLIENT || 'pg',
  //   connection: {
  //     connectionString: process.env.DATABASE_URL, // Para servicios como Heroku, Render
  //     ssl: { rejectUnauthorized: false }, // Necesario para algunas conexiones remotas SSL
  //   },
  //   pool: { ... },
  //   migrations: { ... },
  //   seeds: { ... }
  // }
};

export default config;