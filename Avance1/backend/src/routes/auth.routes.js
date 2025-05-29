// OBSOLETO




// Importa las dependencias necesarias
import { Router } from "express";  // Router de Express para manejar las rutas
import { login, register, logout, profile, verifyToken, deleteUser, deleteLastUser, updateUser } from "../controllers/auth.controller.js"; // Controladores que gestionan las operaciones relacionadas con la autenticación de usuarios
import { authRequired } from '../middlewares/validateToken.js';  // Middleware que asegura que el usuario esté autenticado
import { validateSchema } from "../middlewares/validator.middleware.js"; // Middleware para validar los datos de entrada según un esquema
import { registerSchema, loginSchema } from "../../schemas/auth.schema.js"; // Esquemas de validación para el registro y el inicio de sesión

// Crea una nueva instancia del enrutador de Express
const router = Router();

// Define las rutas y asigna las funciones de los controladores a cada una

// Ruta para registrar un nuevo usuario (POST) - valida los datos con el esquema 'registerSchema' antes de registrar
router.post('/register', validateSchema(registerSchema), register);

// Ruta para iniciar sesión (POST) - valida los datos con el esquema 'loginSchema' antes de iniciar sesión
router.post('/login', validateSchema(loginSchema), login);

// Ruta para cerrar sesión (POST)
router.post('/logout', logout);

// Ruta para verificar el token de acceso (GET)
router.get('/verify', verifyToken);

// Ruta para obtener el perfil del usuario autenticado (GET) - usa el middleware 'authRequired' para asegurar que el usuario esté autenticado
router.get('/profile', authRequired, profile);

// Ruta para eliminar un usuario específico por su ID (DELETE)
router.delete('/delete/:id', deleteUser);

// Ruta para eliminar el último usuario (DELETE)
router.delete('/delete-last', deleteLastUser);

// Ruta para actualizar los datos de un usuario específico por su ID (PUT)
router.put('/update/:id', updateUser);

// Exporta las rutas para que puedan ser usadas en otros archivos
export default router;
