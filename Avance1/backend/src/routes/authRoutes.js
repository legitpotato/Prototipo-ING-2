// OBSOLETO

import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Ruta de registro
router.post('/register', register);
router.post('/login', login);

export default router;
