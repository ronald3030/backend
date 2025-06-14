// src/db/seeds/01_roles.ts
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // 1) Trunca Roles y borra también cualquier fila de Usuarios que lo referencie
  await knex.raw('TRUNCATE TABLE "Roles" CASCADE');

  // 2) Inserta los roles base
  await knex('Roles').insert([
    { id: 1, nombre_rol: 'Venta',      descripcion: 'Usuario de ventas en sucursal' },
    { id: 2, nombre_rol: 'Supervisor', descripcion: 'Supervisor de sucursales' },
    { id: 3, nombre_rol: 'Gerente',    descripcion: 'Gerente con visión global' },
    { id: 4, nombre_rol: 'Admin',      descripcion: 'Administrador del sistema' },
  ]);
}


