
import { Router } from 'express';
import { getPrestamos, createPrestamo, getPrestamo, deletePrestamo, getPrestamosByUserId, updatePrestamosByUserId } from '../controllers/prestamos.controller.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// Ruta para obtener todos los préstamos
router.get('/prestamos', authRequired, getPrestamos);

// Ruta para obtener un préstamo por ID
router.get('/prestamos/:id', authRequired, getPrestamo);

// Ruta para obtener los préstamos de un usuario específico por ID
router.get('/prestamos/user/:id', authRequired, getPrestamosByUserId); // Cambiado a /prestamos/user/:id

// Ruta para crear un nuevo préstamo
router.post('/prestamos', authRequired, createPrestamo);

// Ruta para eliminar un préstamo por ID
router.delete('/prestamos/:id', authRequired, deletePrestamo);

// Ruta para actualizar préstamos por ID de usuario
router.put('/prestamos/user/:id', authRequired, updatePrestamosByUserId); // Cambiado a /prestamos/user/:id

export default router;
