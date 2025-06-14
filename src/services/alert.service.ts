import db from '../config/database';

export async function getAllAlerts() {
  return db('AlertasSistema').select('*');
}

export async function updateAlert(id: number, estado: string) {
  return db('AlertasSistema').where({ id }).update({ estado_alerta: estado }).returning('*');
}
