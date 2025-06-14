import db from '../config/database';

export async function getStockBySucursal(sucursal_id: number) {
  return db('InventarioLotes')
    .where({ sucursal_id })
    .andWhere('cantidad_actual','>',0)
    .select('*');
}

export async function ingressLot(data: any) {
  return db('InventarioLotes').insert(data).returning('*');
}

export async function adjustInventory(data: any) {
  return db.transaction(async trx => {
    await trx('MovimientosInventario').insert(data);
    await trx('InventarioLotes')
      .where({ id: data.inventario_lote_id })
      .increment('cantidad_actual', data.cantidad_movimiento);
  });
}
