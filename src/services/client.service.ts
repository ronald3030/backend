import db from '../config/database';

export async function getAllClients() {
  return db('Clientes').select('*');
}

export async function getClientById(id: number) {
  return db('Clientes').where({ id }).first();
}

export async function createClient(data: any) {
  return db('Clientes').insert(data).returning('*');
}

export async function updateClient(id: number, data: any) {
  return db('Clientes').where({ id }).update(data).returning('*');
}

export async function deleteClient(id: number) {
  return db('Clientes').where({ id }).del();
}
