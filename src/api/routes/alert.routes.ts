import { Router } from 'express';
import { getAllAlerts, updateAlert } from '../controllers/alert.controller';
import { validate } from '../middlewares/validation.middleware';
import { alertValidator } from '../validators/alert.validator';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();
router.get('/', allowRoles('Supervisor','Gerente','Admin'), getAllAlerts);
router.put('/:id', allowRoles('Supervisor','Gerente','Admin'), validate(alertValidator.update), updateAlert);
export default router;
