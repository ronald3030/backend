import { Router } from 'express';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/client.controller';
import { validate } from '../middlewares/validation.middleware';
import { clientValidator } from '../validators/client.validator';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();

// Venta puede ver, crear y editar clientes según los permisos definidos
router.get('/',    allowRoles('Venta','Supervisor','Gerente','Admin'), getAllClients);
router.get('/:id', allowRoles('Venta','Supervisor','Gerente','Admin'), validate(clientValidator.update), getClientById);
router.post('/',   allowRoles('Venta','Supervisor','Gerente','Admin'), validate(clientValidator.create), createClient);
router.put('/:id', allowRoles('Venta','Supervisor','Gerente','Admin'), validate(clientValidator.update), updateClient);
router.delete('/:id', allowRoles('Admin'), deleteClient); // Solo Admin puede eliminar

export default router;
