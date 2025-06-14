// src/db/seeds/03_usuarios.ts
import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // 1) Trunca la tabla Usuarios (y reinicia el contador de IDs)
  await knex.raw('TRUNCATE TABLE "Usuarios" RESTART IDENTITY CASCADE');

  // 2) Define contraseñas planas y genera hashes
  const plainPasswords = {
    venta1:       'venta123',
    supervisor1:  'supervisor123',
    gerente1:     'gerente123',
    admin1:       'admin123',
  };

  const hashes: Record<string, string> = {};
  for (const [user, pwd] of Object.entries(plainPasswords)) {
    hashes[user] = await bcrypt.hash(pwd, 10);
  }

  // 3) Inserta usuarios de ejemplo
  await knex('Usuarios').insert([
    {
      // Cajero en sucursal 1
      nombre_usuario: 'venta1',
      password_hash:  hashes.venta1,
      nombre_completo:'Cajero Uno',
      rol_id:         1,  // Venta
      sucursal_id:    1,  // Central Santo Domingo
      email:          'venta1@farmacosoriental.com',
      activo:         true,
    },
    {
      // Supervisor general
      nombre_usuario: 'supervisor1',
      password_hash:  hashes.supervisor1,
      nombre_completo:'Supervisor Uno',
      rol_id:         2,  // Supervisor
      sucursal_id:    null,
      email:          'supervisor@farmacosoriental.com',
      activo:         true,
    },
    {
      // Gerente
      nombre_usuario: 'gerente1',
      password_hash:  hashes.gerente1,
      nombre_completo:'Gerente Uno',
      rol_id:         3,  // Gerente
      sucursal_id:    null,
      email:          'gerente@farmacosoriental.com',
      activo:         true,
    },
    {
      // Admin
      nombre_usuario: 'admin1',
      password_hash:  hashes.admin1,
      nombre_completo:'Administrador',
      rol_id:         4,  // Admin
      sucursal_id:    null,
      email:          'admin@farmacosoriental.com',
      activo:         true,
    },
  ]);
}

