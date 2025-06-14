import { Router } from 'express';
import { getStock, ingressLot, adjustInventory } from '../controllers/inventory.controller';
import { validate } from '../middlewares/validation.middleware';
import { inventoryValidator } from '../validators/inventory.validator';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();
router.get('/sucursal/:sucursalId', allowRoles('Venta','Supervisor','Gerente','Admin'), getStock);
router.post('/lotes',             allowRoles('Supervisor','Admin'), validate(inventoryValidator.ingress), ingressLot);
router.post('/ajuste',            allowRoles('Supervisor','Admin'), validate(inventoryValidator.adjust), adjustInventory);
export default router;
