import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';

import { validate } from '../middlewares/validation.middleware';
import { productValidator } from '../validators/product.validator';

const router = Router();

// Listar todos los productos
router.get('/', getAllProducts);

// Obtener un producto por ID
router.get('/:id', getProductById);

// Crear nuevo producto
router.post(
  '/',
  validate(productValidator.create),
  createProduct
);

// Actualizar producto existente
router.put(
  '/:id',
  validate(productValidator.update),
  updateProduct
);

// Eliminar producto
router.delete('/:id', deleteProduct);

export default router;

