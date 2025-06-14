import { Router } from 'express';
import { login, refresh, getProfile } from '../controllers/auth.controller';
import { loginValidator, refreshValidator } from '../validators/auth.validator';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// POST /api/auth/login
router.post('/login', validate(loginValidator), login);

// POST /api/auth/refresh
router.post('/refresh', validate(refreshValidator), refresh);

// GET /api/auth/profile - obtener información del usuario autenticado
router.get('/profile', getProfile);

export default router;
