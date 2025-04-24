import express from 'express';
import { crearReserva } from '../controllers/prestamos.controller.js'

const router = express.Router();

// Ruta para crear una nueva reserva
router.post('/reservas', crearReserva);

export default router;
