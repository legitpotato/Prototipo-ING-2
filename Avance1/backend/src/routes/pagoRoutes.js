import express from 'express';
import {
  crearPagoController,
  obtenerPagosController,
  obtenerPagoPorIdController,
  obtenerPagosPendientesController,
  obtenerPagosPagadosController,
  marcarPagoComoPagadoController,
  obtenerTodoPagosController 
} from '../controllers/pagoController.js';

import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js'; // 👈 importa el middleware

const router = express.Router();

// Aplica el middleware SOLO a rutas que deben estar protegidas
router.patch('/pagos/:id/pagar', verifyFirebaseToken, marcarPagoComoPagadoController);
router.get('/pagos/pendientes', verifyFirebaseToken, obtenerPagosPendientesController);
router.get('/pagos/pagados', verifyFirebaseToken, obtenerPagosPagadosController);
router.get('/pagos/:id', verifyFirebaseToken, obtenerPagoPorIdController);
router.get('/pagos', verifyFirebaseToken, obtenerPagosController); // 👈 protegido
router.post('/pagos', verifyFirebaseToken, crearPagoController);   // opcionalmente protegido
router.get('/pagos/todos', verifyFirebaseToken, obtenerTodoPagosController);

export default router;
