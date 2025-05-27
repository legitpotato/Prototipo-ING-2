import express from 'express';
import {
  crearPagoController,
  obtenerPagosController,
  obtenerPagoPorIdController,
  obtenerPagosPendientesController,
  obtenerPagosPagadosController,
  marcarPagoComoPagadoController
} from '../controllers/pagoController.js';

const router = express.Router();

router.patch('/pagos/:id/pagar', marcarPagoComoPagadoController);
router.get('/pagos/pendientes', obtenerPagosPendientesController);
router.get('/pagos/pagados', obtenerPagosPagadosController);
router.get('/pagos/:id', obtenerPagoPorIdController);            
router.get('/pagos', obtenerPagosController);
router.post('/pagos', crearPagoController);

export default router;
