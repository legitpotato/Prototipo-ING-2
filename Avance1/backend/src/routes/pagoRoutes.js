import express from 'express';
import {crearPagoController, obtenerPagosController, obtenerPagoPorIdController, obtenerPagosPendientesController, obtenerPagosPagadosController} from '../controllers/pagoController';

const router = express.Router();

router.post('/pagos', crearPagoController);
router.get('/pagos/pendientes', obtenerPagosPendientesController); // primero las más específicas
router.get('/pagos/pagados', obtenerPagosPagadosController);       // luego las otras específicas
router.get('/pagos/:id', obtenerPagoPorIdController);              // y por último la dinámica
router.get('/pagos', obtenerPagosController);

export default router;
