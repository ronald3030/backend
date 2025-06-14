// src/config/database.ts
import knexConstructor, { Knex } from 'knex';
import path from 'path';
import appRoot from 'app-root-path';
import {
  DB_CLIENT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} from './env'; // Importa desde env.ts

const knexConfig: Knex.Config = {
  client: DB_CLIENT,
  connection: {
    host:     DB_HOST,
    port:     DB_PORT, // Ya es un número gracias a env.ts
    user:     DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  },
  pool: { min: 2, max: 10 },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.resolve(appRoot.path, 'src/db/migrations')
  },
  seeds: {
    directory: path.resolve(appRoot.path, 'src/db/seeds')
  }
};

const db: Knex = knexConstructor(knexConfig);

// La prueba de conexión se hace en server.ts antes de iniciar,
// por lo que la eliminamos de aquí para evitar redundancia.

export default db;


