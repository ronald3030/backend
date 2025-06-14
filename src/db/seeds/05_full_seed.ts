import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Limpieza ordenada
  await knex('VentaDetalles').del();
  await knex('Ventas').del();
  await knex('MovimientosInventario').del();
  await knex('AlertasSistema').del();
  await knex('InventarioLotes').del();
  await knex('Usuarios').del();
  await knex('Clientes').del();
  await knex('Productos').del();
  await knex('CategoriasProducto').del();
  await knex('Sucursales').del();
  await knex('Roles').del();

  // Roles
  const roles = await knex('Roles')
    .insert([
      { nombre_rol: 'Venta',      descripcion: 'Usuario de venta en sucursal' },
      { nombre_rol: 'Supervisor', descripcion: 'Supervisor de sucursales' },
      { nombre_rol: 'Gerente',    descripcion: 'Gerente del sistema' },
      { nombre_rol: 'Admin',      descripcion: 'Administrador' },
    ])
    .returning('id');
  const [ventaRole, supervisorRole, gerenteRole, adminRole] = roles.map(r => r.id);

  // Sucursales
  const sucursales = await knex('Sucursales')
    .insert([
      { nombre_sucursal: 'Central',   codigo_sucursal: 'CENTRAL', direccion: 'Av. Principal 100', telefono: '100-0000' },
      { nombre_sucursal: 'Sucursal1', codigo_sucursal: 'SUC1',    direccion: 'Calle 1 #123',      telefono: '200-0001' },
      { nombre_sucursal: 'Sucursal2', codigo_sucursal: 'SUC2',    direccion: 'Calle 2 #456',      telefono: '200-0002' },
    ])
    .returning('id');
  const [centralId, suc1Id, suc2Id] = sucursales.map(r => r.id);

  // Categorías
  const cats = await knex('CategoriasProducto')
    .insert([
      { nombre_categoria: 'Analgésicos' },
      { nombre_categoria: 'Antibióticos' },
      { nombre_categoria: 'Vitaminas' },
    ])
    .returning('id');
  const [catAnalgesicos, catAntibioticos, catVitaminas] = cats.map(r => r.id);

  // Productos
  const prods = await knex('Productos')
    .insert([
      { nombre_producto: 'Ibuprofeno 400mg', codigo_barras: '1234567890123', categoria_id: catAnalgesicos, precio_venta_sugerido: 25 },
      { nombre_producto: 'Amoxicilina 500mg', codigo_barras: '2345678901234', categoria_id: catAntibioticos, precio_venta_sugerido: 40 },
      { nombre_producto: 'Vitamina C 1000mg', codigo_barras: '3456789012345', categoria_id: catVitaminas,   precio_venta_sugerido: 15 },
    ])
    .returning('id');
  const [prodIbuprofeno, prodAmoxicilina, prodVitC] = prods.map(r => r.id);

  // Clientes
  const clients = await knex('Clientes')
    .insert([
      { nombres: 'Juan', apellidos: 'Pérez', email: 'juan.perez@mail.com' },
      { nombres: 'Ana',  apellidos: 'Gómez', email: 'ana.gomez@mail.com' },
    ])
    .returning('id');
  const [cliJuan, cliAna] = clients.map(r => r.id);

  // Usuarios
  const hash = (p: string) => bcrypt.hashSync(p, 10);
  const users = await knex('Usuarios')
    .insert([
      { nombre_usuario: 'venta1',     password_hash: hash('venta123'),       nombre_completo: 'Cajero Uno',     rol_id: ventaRole,      sucursal_id: suc1Id, email: 'venta1@farmacosoriental.com' },
      { nombre_usuario: 'supervisor1', password_hash: hash('supervisor123'), nombre_completo: 'Supervisor Uno',rol_id: supervisorRole, sucursal_id: null,   email: 'supervisor@farmacosoriental.com' },
      { nombre_usuario: 'gerente1',    password_hash: hash('gerente123'),    nombre_completo: 'Gerente Uno',    rol_id: gerenteRole,    sucursal_id: null,   email: 'gerente@farmacosoriental.com' },
      { nombre_usuario: 'admin1',      password_hash: hash('admin123'),      nombre_completo: 'Administrador',   rol_id: adminRole,      sucursal_id: null,   email: 'admin@farmacosoriental.com' }
    ])
    .returning('id');
  const ventaUserId = users[0].id;

  // InventarioLotes
  interface Lote { producto_id: number; sucursal_id: number; lote_numero: string; fecha_vencimiento: string; cantidad_actual: number; }
  const hoy = new Date();
  const proxMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate()).toISOString().split('T')[0];
  const lotes: Lote[] = [
    { producto_id: prodIbuprofeno, sucursal_id: suc1Id, lote_numero: 'L-1-1-A', fecha_vencimiento: proxMes, cantidad_actual: 100 },
    { producto_id: prodAmoxicilina, sucursal_id: suc1Id, lote_numero: 'L-2-1-A', fecha_vencimiento: proxMes, cantidad_actual: 100 },
    { producto_id: prodVitC,       sucursal_id: suc1Id, lote_numero: 'L-3-1-A', fecha_vencimiento: proxMes, cantidad_actual: 100 },
  ];
  const lotesInserted = await knex('InventarioLotes').insert(lotes).returning('id');
  const loteIds = lotesInserted.map(r => r.id);

  // MovimientosInventario
  await knex('MovimientosInventario').insert(
    loteIds.map(id => ({
      inventario_lote_id: id,
      producto_id: lotes.find(l=>loteIds.indexOf(id)!==-1)!.producto_id,
      sucursal_id: lotes.find(l=>loteIds.indexOf(id)!==-1)!.sucursal_id,
      usuario_id: ventaUserId,
      tipo_movimiento: 'INGRESO_COMPRA',
      cantidad_movimiento: lotes.find(l=>loteIds.indexOf(id)!==-1)!.cantidad_actual,
      cantidad_anterior: 0,
      cantidad_posterior: lotes.find(l=>loteIds.indexOf(id)!==-1)!.cantidad_actual,
      justificacion: 'Stock inicial',
    }))
  );

  // Ventas y detalles
  const sales = await knex('Ventas')
    .insert({ sucursal_id: suc1Id, usuario_id: ventaUserId, cliente_id: cliJuan, subtotal: 50, descuento_total: 0, impuestos_total: 0, total_venta: 50, metodo_pago: 'EFECTIVO', numero_factura: `F-${Date.now()}` })
    .returning('id');
  const venta1Id = sales[0].id;
  await knex('VentaDetalles').insert({ venta_id: venta1Id, inventario_lote_id: loteIds[0], producto_id: prodIbuprofeno, cantidad_vendida: 2, precio_unitario_venta: 25, subtotal_item: 50 });

  // AlertasSistema
  await knex('AlertasSistema').insert({ tipo_alerta: 'BAJO_STOCK', mensaje_alerta: 'Ibuprofeno en Sucursal1 bajo stock mínimo', producto_id: prodIbuprofeno, inventario_lote_id: loteIds[0], sucursal_id: suc1Id, nivel_severidad: 'ADVERTENCIA', estado_alerta: 'NUEVA' });
}


