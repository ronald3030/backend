import { Knex } from 'knex';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const common: Knex.Config = {
  client: process.env.DB_CLIENT,
  connection: {
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT),
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: path.resolve(__dirname, 'src/db/migrations'),
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: path.resolve(__dirname, 'src/db/seeds')
  }
};

module.exports = {
  development: common,
  production: common
};

