import express from 'express';
import { analizarMorosidad, analizarMorosidadIA } from '../controllers/morosidadController.js';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';
import { analizarMorosidadPorRut } from '../controllers/morosidadController.js';

const router = express.Router();

router.get('/morosidad/analisis', verifyFirebaseToken, analizarMorosidad);
router.get('/morosidad/ia', verifyFirebaseToken, analizarMorosidadIA);
router.get('/morosidad/por-rut/:rut', verifyFirebaseToken, analizarMorosidadPorRut);

export default router;
