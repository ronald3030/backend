import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Tabla Roles
  await knex.schema.createTable('Roles', (table) => {
    table.increments('id').primary();
    table.string('nombre_rol', 50).notNullable().unique();
    table.text('descripcion');
    table.timestamps(true, true);
  });

  // Tabla Sucursales
  await knex.schema.createTable('Sucursales', (table) => {
    table.increments('id').primary();
    table.string('nombre_sucursal', 100).notNullable();
    table.string('codigo_sucursal', 20).notNullable().unique();
    table.text('direccion');
    table.string('telefono', 20);
    table.boolean('activo').defaultTo(true);
    table.timestamps(true, true);
  });

  // Tabla CategoriasProducto
  await knex.schema.createTable('CategoriasProducto', (table) => {
    table.increments('id').primary();
    table.string('nombre_categoria', 100).notNullable();
    table.text('descripcion');
    table.timestamps(true, true);
  });

  // Tabla Productos
  await knex.schema.createTable('Productos', (table) => {
    table.increments('id').primary();
    table.string('nombre_producto', 200).notNullable();
    table.string('codigo_barras', 50).unique();
    table.integer('categoria_id').unsigned().references('id').inTable('CategoriasProducto').onDelete('SET NULL');
    table.decimal('precio_venta_sugerido', 10, 2);
    table.text('descripcion');
    table.boolean('activo').defaultTo(true);
    table.timestamps(true, true);
  });

  // Tabla Clientes
  await knex.schema.createTable('Clientes', (table) => {
    table.increments('id').primary();
    table.string('nombres', 100).notNullable();
    table.string('apellidos', 100).notNullable();
    table.string('email', 150);
    table.string('telefono', 20);
    table.text('direccion');
    table.string('cedula', 20);
    table.timestamps(true, true);
  });

  // Tabla Usuarios
  await knex.schema.createTable('Usuarios', (table) => {
    table.increments('id').primary();
    table.string('nombre_usuario', 50).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('nombre_completo', 200).notNullable();
    table.integer('rol_id').unsigned().notNullable().references('id').inTable('Roles').onDelete('RESTRICT');
    table.integer('sucursal_id').unsigned().references('id').inTable('Sucursales').onDelete('SET NULL');
    table.string('email', 150);
    table.boolean('activo').defaultTo(true);
    table.timestamps(true, true);
  });

  // Tabla InventarioLotes
  await knex.schema.createTable('InventarioLotes', (table) => {
    table.increments('id').primary();
    table.integer('producto_id').unsigned().notNullable().references('id').inTable('Productos').onDelete('CASCADE');
    table.integer('sucursal_id').unsigned().notNullable().references('id').inTable('Sucursales').onDelete('CASCADE');
    table.string('lote_numero', 50).notNullable();
    table.date('fecha_vencimiento').notNullable();
    table.integer('cantidad_actual').notNullable().defaultTo(0);
    table.integer('stock_minimo').defaultTo(10);
    table.decimal('precio_compra', 10, 2);
    table.timestamps(true, true);
    table.unique(['producto_id', 'sucursal_id', 'lote_numero']);
  });

  // Tabla Ventas
  await knex.schema.createTable('Ventas', (table) => {
    table.increments('id').primary();
    table.integer('sucursal_id').unsigned().notNullable().references('id').inTable('Sucursales').onDelete('RESTRICT');
    table.integer('usuario_id').unsigned().notNullable().references('id').inTable('Usuarios').onDelete('RESTRICT');
    table.integer('cliente_id').unsigned().references('id').inTable('Clientes').onDelete('SET NULL');
    table.decimal('subtotal', 10, 2).notNullable();
    table.decimal('descuento_total', 10, 2).defaultTo(0);
    table.decimal('impuestos_total', 10, 2).defaultTo(0);
    table.decimal('total_venta', 10, 2).notNullable();
    table.enum('metodo_pago', ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA']).notNullable();
    table.string('numero_factura', 50);
    table.timestamps(true, true);
  });

  // Tabla VentaDetalles
  await knex.schema.createTable('VentaDetalles', (table) => {
    table.increments('id').primary();
    table.integer('venta_id').unsigned().notNullable().references('id').inTable('Ventas').onDelete('CASCADE');
    table.integer('inventario_lote_id').unsigned().notNullable().references('id').inTable('InventarioLotes').onDelete('RESTRICT');
    table.integer('producto_id').unsigned().notNullable().references('id').inTable('Productos').onDelete('RESTRICT');
    table.integer('cantidad_vendida').notNullable();
    table.decimal('precio_unitario_venta', 10, 2).notNullable();
    table.decimal('subtotal_item', 10, 2).notNullable();
    table.timestamps(true, true);
  });

  // Tabla MovimientosInventario
  await knex.schema.createTable('MovimientosInventario', (table) => {
    table.increments('id').primary();
    table.integer('inventario_lote_id').unsigned().notNullable().references('id').inTable('InventarioLotes').onDelete('CASCADE');
    table.integer('producto_id').unsigned().notNullable().references('id').inTable('Productos').onDelete('RESTRICT');
    table.integer('sucursal_id').unsigned().notNullable().references('id').inTable('Sucursales').onDelete('RESTRICT');
    table.integer('usuario_id').unsigned().notNullable().references('id').inTable('Usuarios').onDelete('RESTRICT');
    table.enum('tipo_movimiento', ['INGRESO_COMPRA', 'SALIDA_VENTA', 'AJUSTE_INVENTARIO', 'TRANSFERENCIA']).notNullable();
    table.integer('cantidad_movimiento').notNullable();
    table.integer('cantidad_anterior').notNullable();
    table.integer('cantidad_posterior').notNullable();
    table.text('justificacion');
    table.timestamps(true, true);
  });

  // Tabla AlertasSistema
  await knex.schema.createTable('AlertasSistema', (table) => {
    table.increments('id').primary();
    table.enum('tipo_alerta', ['BAJO_STOCK', 'VENCIMIENTO_PROXIMO', 'PRODUCTO_VENCIDO']).notNullable();
    table.text('mensaje_alerta').notNullable();
    table.integer('producto_id').unsigned().references('id').inTable('Productos').onDelete('CASCADE');
    table.integer('inventario_lote_id').unsigned().references('id').inTable('InventarioLotes').onDelete('CASCADE');
    table.integer('sucursal_id').unsigned().references('id').inTable('Sucursales').onDelete('CASCADE');
    table.enum('nivel_severidad', ['INFO', 'ADVERTENCIA', 'CRITICO']).defaultTo('INFO');
    table.enum('estado_alerta', ['NUEVA', 'VISTA', 'RESUELTA']).defaultTo('NUEVA');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('AlertasSistema');
  await knex.schema.dropTableIfExists('MovimientosInventario');
  await knex.schema.dropTableIfExists('VentaDetalles');
  await knex.schema.dropTableIfExists('Ventas');
  await knex.schema.dropTableIfExists('InventarioLotes');
  await knex.schema.dropTableIfExists('Usuarios');
  await knex.schema.dropTableIfExists('Clientes');
  await knex.schema.dropTableIfExists('Productos');
  await knex.schema.dropTableIfExists('CategoriasProducto');
  await knex.schema.dropTableIfExists('Sucursales');
  await knex.schema.dropTableIfExists('Roles');
}

