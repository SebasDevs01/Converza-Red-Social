// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);

import express from 'express';

const app = express();

// Agregar para que Express entienda JSON en body
app.use(express.json());

// Importar rutas
import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);

// ...otras rutas y configuraciones
