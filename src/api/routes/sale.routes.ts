import { Router } from 'express';
import { createSale } from '../controllers/sale.controller';
import { validate } from '../middlewares/validation.middleware';
import { saleValidator } from '../validators/sale.validator';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();
router.post('/', allowRoles('Venta','Supervisor','Admin'), validate(saleValidator.create), createSale);
export default router;
