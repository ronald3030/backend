import db from '../config/database';

export async function createSale(data: any) {
  return db.transaction(async trx => {
    // Calcular total de la venta
    const total = data.items.reduce(
      (sum: number, item: any) => sum + item.cantidad_vendida * item.precio_unitario_venta,
      0
    );

    // Insertar registro de venta
    const [sale] = await trx('Ventas')
      .insert({
        sucursal_id: data.sucursal_id,
        usuario_id: data.usuario_id,
        cliente_id: data.cliente_id,
        subtotal: total,
        descuento_total: 0,
        impuestos_total: 0,
        total_venta: total,
        metodo_pago: data.metodo_pago,
        numero_factura: `F-${Date.now()}`,
      })
      .returning('*');

    // Insertar detalles de venta y ajustar stock
    for (const it of data.items) {
      await trx('VentaDetalles').insert({
        venta_id: sale.id,
        inventario_lote_id: it.inventario_lote_id,
        producto_id: it.producto_id,
        cantidad_vendida: it.cantidad_vendida,
        precio_unitario_venta: it.precio_unitario_venta,
        subtotal_item: it.cantidad_vendida * it.precio_unitario_venta,
        despachado_desde_sucursal_id: it.despachado_desde_sucursal_id,
      });

      await trx('InventarioLotes')
        .where({ id: it.inventario_lote_id })
        .decrement('cantidad_actual', it.cantidad_vendida);
    }

    return sale;
  });
}

