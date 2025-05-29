import express from 'express';
import {
  crearPagoController,
  obtenerPagosController,
  obtenerPagoPorIdController,
  obtenerPagosPendientesController,
  obtenerPagosPagadosController,
  marcarPagoComoPagadoController,
  obtenerTodosLosPagosController // asegúrate de que esté importado con este nombre
} from '../controllers/pagoController.js';

import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';

const router = express.Router();

// ✅ Rutas más específicas primero
router.get('/pagos/todos', verifyFirebaseToken, obtenerTodosLosPagosController);
router.get('/pagos/pendientes', verifyFirebaseToken, obtenerPagosPendientesController);
router.get('/pagos/pagados', verifyFirebaseToken, obtenerPagosPagadosController);
router.get('/pagos', verifyFirebaseToken, obtenerPagosController);
router.post('/pagos', verifyFirebaseToken, crearPagoController);
router.patch('/pagos/:id/pagar', verifyFirebaseToken, marcarPagoComoPagadoController);
router.get('/pagos/:id', verifyFirebaseToken, obtenerPagoPorIdController); // esta va al final


export default router;
