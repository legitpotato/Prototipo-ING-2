import express from 'express';
import { crearIncidencia, obtenerIncidenciasPorComunidad, actualizarIncidencia } from '../controllers/incidenciasController.js';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';  // importarlo

const router = express.Router();

router.post('/', verifyFirebaseToken, crearIncidencia);
router.get('/comunidad/:comunidadId', verifyFirebaseToken, obtenerIncidenciasPorComunidad);
router.patch('/:id', verifyFirebaseToken, actualizarIncidencia);

export default router;
