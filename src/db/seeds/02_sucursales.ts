// src/db/seeds/02_sucursales.ts
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Trunca y reinicia identidad si lo deseas:
  await knex.raw('TRUNCATE TABLE "Sucursales" RESTART IDENTITY CASCADE');

  await knex('Sucursales').insert([
    {
      id: 1,
      nombre_sucursal: 'Central Santo Domingo',
      codigo_sucursal: 'CSD',
      direccion: 'Av. Principal 123',
      telefono: '809-000-0000',
      email_sucursal: 'central@farmacosoriental.com'
    },
    {
      id: 2,
      nombre_sucursal: 'Sucursal Santiago',
      codigo_sucursal: 'SSA',
      direccion: 'Calle Secundaria 45',
      telefono: '809-111-1111',
      email_sucursal: 'santiago@farmacosoriental.com'
    },
  ]);
}



