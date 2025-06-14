// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Importar todas las rutas
import authRoutes from './api/routes/auth.routes';
import productRoutes from './api/routes/product.routes';
import clientRoutes from './api/routes/client.routes';
import inventoryRoutes from './api/routes/inventory.routes';
import saleRoutes from './api/routes/sale.routes';
import alertRoutes from './api/routes/alert.routes';

// Middlewares
import { errorHandler } from './api/middlewares/error.middleware';

const app = express();

// Configuración de CORS más específica para frontend
app.use(cors({
  origin: [
    'http://localhost:3000',  // React dev server
    'http://localhost:5173',  // Vite dev server
    'http://localhost:4200',  // Angular dev server
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4200'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Montar todas las rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/alerts', alertRoutes);

// Ruta de salud del servidor
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta para verificar las rutas disponibles (útil para desarrollo)
app.get('/api/routes', (_req, res) => {
  res.json({
    available_routes: [
      'POST /api/auth/login',
      'POST /api/auth/refresh',
      'GET /api/auth/profile',
      'GET /api/products',
      'GET /api/clients',
      'GET /api/inventory/sucursal/:sucursalId',
      'POST /api/sales',
      'GET /api/alerts',
      'GET /api/health'
    ]
  });
});

// Middleware de manejo de errores al final
app.use(errorHandler);

export default app;
