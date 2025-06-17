import express from 'express';
import { crearComunidad, listarComunidades, asignarUsuarioAComunidad,  obtenerComunidadesDelUsuario} from '../controllers/comunidadController.js';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';
import { listarUsuariosDeComunidad, actualizarRolUsuario} from '../controllers/comunidadController.js';
import { validarComunidad } from '../middlewares/validarComunidad.js';
import { verificarRolDirectiva } from '../middlewares/verificarRolDirectiva.js';


const router = express.Router();

// Crear nueva comunidad
router.post('/', verifyFirebaseToken, crearComunidad);

// Listar todas las comunidades
router.get('/', verifyFirebaseToken, listarComunidades);

// Asignar usuario a comunidad
router.post('/:id/usuarios', verifyFirebaseToken, asignarUsuarioAComunidad);

// Obtener comunidades del usuario
router.get('/mis-comunidades', verifyFirebaseToken, obtenerComunidadesDelUsuario);

// Listar usuarios de una comunidad
router.get('/:id/usuarios', verifyFirebaseToken, validarComunidad, verificarRolDirectiva, listarUsuariosDeComunidad);

// Actualizar rol de un usuario en una comunidad
router.put('/:id/usuarios/:userId', verifyFirebaseToken, validarComunidad, verificarRolDirectiva, actualizarRolUsuario);



export default router;
