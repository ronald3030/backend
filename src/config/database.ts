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

const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    };

const knexConfig: Knex.Config = {
  client: DB_CLIENT || 'pg',
  connection: connectionConfig,
  pool: { min: 2, max: 10 },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.resolve(__dirname, '..', 'db/migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'db/seeds')
  }
};

const db: Knex = knexConstructor(knexConfig);
export default db;



