import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Roles
  await knex.schema.createTable('Roles', (table) => {
    table.increments('id').primary();
    table.string('nombre_rol', 50).notNullable().unique();
    table.text('descripcion').nullable();
  });

  // 2. Sucursales
  await knex.schema.createTable('Sucursales', (table) => {
    table.increments('id').primary();
    table.string('nombre_sucursal', 150).notNullable();
    table.string('codigo_sucursal', 20).notNullable().unique();
    table.string('direccion', 255).nullable();
    table.string('telefono', 50).nullable();
    table.string('email_sucursal', 255).nullable();
    table.boolean('activo').notNullable().defaultTo(true);
  });

  // 3. Usuarios
  await knex.schema.createTable('Usuarios', (table) => {
    table.increments('id').primary();
    table.string('nombre_usuario', 100).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('nombre_completo', 255).notNullable();
    table
      .integer('rol_id').unsigned().notNullable()
      .references('id').inTable('Roles')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table
      .integer('sucursal_id').unsigned().nullable()
      .references('id').inTable('Sucursales')
      .onDelete('SET NULL').onUpdate('CASCADE');
    table.string('email', 255).unique().nullable();
    table.boolean('activo').notNullable().defaultTo(true);
    table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
    table.timestamp('ultima_modificacion').defaultTo(knex.fn.now());
  });

  // 4. Categorías de Producto
  await knex.schema.createTable('CategoriasProducto', (table) => {
    table.increments('id').primary();
    table.string('nombre_categoria', 100).notNullable().unique();
    table.text('descripcion').nullable();
  });

  // 5. Productos
  await knex.schema.createTable('Productos', (table) => {
    table.increments('id').primary();
    table.string('codigo_barras', 100).unique().nullable();
    table.string('nombre_producto', 255).notNullable();
    table.string('descripcion_corta', 255).nullable();
    table.text('descripcion_larga').nullable();
    table
      .integer('categoria_id').unsigned().notNullable()
      .references('id').inTable('CategoriasProducto')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.string('unidad_medida', 50).nullable();
    table.decimal('precio_costo_promedio', 10, 2).nullable();
    table.decimal('precio_venta_sugerido', 10, 2).notNullable();
    table.integer('stock_minimo_alerta').notNullable().defaultTo(5);
    table.boolean('requiere_receta').notNullable().defaultTo(false);
    table.boolean('activo').notNullable().defaultTo(true);
    table.string('imagen_url', 500).nullable();
  });

  // 6. Inventario por Lotes
  await knex.schema.createTable('InventarioLotes', (table) => {
    table.increments('id').primary();
    table
      .integer('producto_id').unsigned().notNullable()
      .references('id').inTable('Productos')
      .onDelete('CASCADE').onUpdate('CASCADE');
    table
      .integer('sucursal_id').unsigned().notNullable()
      .references('id').inTable('Sucursales')
      .onDelete('CASCADE').onUpdate('CASCADE');
    table.string('lote_numero', 100).notNullable();
    table.date('fecha_vencimiento').notNullable();
    table.integer('cantidad_actual').notNullable().checkPositive();
    table.decimal('precio_compra_lote', 10, 2).nullable();
    table.timestamp('fecha_ingreso').defaultTo(knex.fn.now());
    table.unique(['producto_id', 'sucursal_id', 'lote_numero', 'fecha_vencimiento'], 'uq_inventario_lote');
  });

  // 7. Clientes
  await knex.schema.createTable('Clientes', (table) => {
    table.increments('id').primary();
    table.string('dni_ruc', 20).unique().nullable();
    table.string('nombres', 150).notNullable();
    table.string('apellidos', 150).notNullable();
    table.string('telefono', 50).nullable();
    table.string('email', 255).unique().nullable();
    table.string('direccion_cliente', 255).nullable();
    table.date('fecha_nacimiento').nullable();
    table.integer('puntos_fidelidad').notNullable().defaultTo(0);
    table.timestamp('fecha_registro').defaultTo(knex.fn.now());
  });

  // 8. Ventas
  await knex.schema.createTable('Ventas', (table) => {
    table.bigIncrements('id').primary();
    table.string('numero_factura', 50).unique().notNullable();
    table
      .integer('sucursal_id').unsigned().notNullable()
      .references('id').inTable('Sucursales')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table
      .integer('usuario_id').unsigned().notNullable()
      .references('id').inTable('Usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table
      .integer('cliente_id').unsigned().nullable()
      .references('id').inTable('Clientes')
      .onDelete('SET NULL').onUpdate('CASCADE');
    table.timestamp('fecha_venta').defaultTo(knex.fn.now());
    table.decimal('subtotal', 12, 2).notNullable();
    table.decimal('descuento_total', 12, 2).defaultTo(0);
    table.decimal('impuestos_total', 12, 2).defaultTo(0);
    table.decimal('total_venta', 12, 2).notNullable();
    table.string('metodo_pago', 50).nullable();
    table.string('estado_venta', 30).notNullable().defaultTo('COMPLETADA');
    table.text('observaciones').nullable();
  });

  // 9. Detalles de Venta
  await knex.schema.createTable('VentaDetalles', (table) => {
    table.bigIncrements('id').primary();
    table
      .bigInteger('venta_id').unsigned().notNullable()
      .references('id').inTable('Ventas')
      .onDelete('CASCADE').onUpdate('CASCADE');
    table
      .integer('inventario_lote_id').unsigned().notNullable()
      .references('id').inTable('InventarioLotes')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table
      .integer('producto_id').unsigned().notNullable()
      .references('id').inTable('Productos')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.integer('cantidad_vendida').notNullable();
    table.decimal('precio_unitario_venta', 10, 2).notNullable();
    table.decimal('descuento_item', 10, 2).defaultTo(0);
    table.decimal('subtotal_item', 12, 2).notNullable();
    table
      .integer('despachado_desde_sucursal_id').unsigned().nullable()
      .references('id').inTable('Sucursales')
      .onDelete('SET NULL').onUpdate('CASCADE');
  });

  // 10. Movimientos de Inventario
  await knex.schema.createTable('MovimientosInventario', (table) => {
    table.bigIncrements('id').primary();
    table
      .integer('inventario_lote_id').unsigned().notNullable()
      .references('id').inTable('InventarioLotes')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table
      .integer('producto_id').unsigned().notNullable()
      .references('id').inTable('Productos')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table
      .integer('sucursal_id').unsigned().notNullable()
      .references('id').inTable('Sucursales')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table
      .integer('usuario_id').unsigned().notNullable()
      .references('id').inTable('Usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.string('tipo_movimiento', 50).notNullable();
    table.integer('cantidad_movimiento').notNullable();
    table.integer('cantidad_anterior').notNullable();
    table.integer('cantidad_posterior').notNullable();
    table.timestamp('fecha_movimiento').defaultTo(knex.fn.now());
    table.bigInteger('referencia_id').nullable();
    table.text('justificacion').nullable();
  });

  // 11. Alertas del Sistema
  await knex.schema.createTable('AlertasSistema', (table) => {
    table.increments('id').primary();
    table.string('tipo_alerta', 50).notNullable();
    table.text('mensaje_alerta').notNullable();
    table
      .integer('producto_id').unsigned().nullable()
      .references('id').inTable('Productos')
      .onDelete('SET NULL').onUpdate('CASCADE');
    table
      .integer('inventario_lote_id').unsigned().nullable()
      .references('id').inTable('InventarioLotes')
      .onDelete('SET NULL').onUpdate('CASCADE');
    table
      .integer('sucursal_id').unsigned().nullable()
      .references('id').inTable('Sucursales')
      .onDelete('SET NULL').onUpdate('CASCADE');
    table.string('nivel_severidad', 20).defaultTo('INFO');
    table.string('estado_alerta', 20).defaultTo('NUEVA');
    table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
    table.timestamp('fecha_resolucion').nullable();
    table
      .integer('usuario_resolvio_id').unsigned().nullable()
      .references('id').inTable('Usuarios')
      .onDelete('SET NULL').onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  // El orden de borrado inverso al de creación
  await knex.schema.dropTableIfExists('AlertasSistema');
  await knex.schema.dropTableIfExists('MovimientosInventario');
  await knex.schema.dropTableIfExists('VentaDetalles');
  await knex.schema.dropTableIfExists('Ventas');
  await knex.schema.dropTableIfExists('Clientes');
  await knex.schema.dropTableIfExists('InventarioLotes');
  await knex.schema.dropTableIfExists('Productos');
  await knex.schema.dropTableIfExists('CategoriasProducto');
  await knex.schema.dropTableIfExists('Usuarios');
  await knex.schema.dropTableIfExists('Sucursales');
  await knex.schema.dropTableIfExists('Roles');
}
