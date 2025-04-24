// Importa las dependencias necesarias
import { Router } from "express";  // Router de Express para manejar las rutas
import { authRequired } from "../middlewares/validateToken.js";  // Middleware para asegurar que el usuario esté autenticado
import { getTasks, getTask, createTask, updateTask, deleteTask, getTaskByCod, getTasksByCategoria, getTasksByAutor, getTasksByTitle } from "../controllers/tasks.controller.js";  // Controladores que gestionan las operaciones relacionadas con las documentos
import { validateSchema } from "../middlewares/validator.middleware.js";  // Middleware para validar los datos de entrada según un esquema
import { createTaskSchema } from "../schemas/task.schema.js";  // Esquema de validación para la creación de documentos
import { isAdmin } from "../middlewares/isAdmin.js";  // Middleware para verificar si el usuario tiene privilegios de administrador

// Crea una nueva instancia del enrutador de Express
const router = Router();

// Rutas para las operaciones CRUD de las documentos

// Ruta para obtener todas los documentos (GET)
router.get('/tasks', getTasks);

// Ruta para obtener un documento específico por su ID (GET) - requiere autenticación
router.get('/tasks/:id', authRequired, getTask);

// Ruta para crear un nuevo documento (POST) - requiere autenticación y validación de datos con el esquema 'createTaskSchema'
router.post('/tasks', authRequired, validateSchema(createTaskSchema), createTask);

// Ruta para eliminar un documento específico por su ID (DELETE) - requiere autenticación y privilegios de administrador
router.delete('/tasks/:id', authRequired, deleteTask);

// Ruta para actualizar un documento específico por su ID (PUT) - requiere autenticación y privilegios de administrador
router.put('/tasks/:id', authRequired, updateTask);

// Ruta para obtener un documento específica por su código (GET)
router.get('/tasks/cod/:cod', getTaskByCod);

// Ruta para obtener todos las documentos por categoría (GET)
router.get('/tasks/categoria/:categoria', getTasksByCategoria);

// Ruta para obtener todos las documentos por autor (GET)
router.get('/tasks/autor/:autor', getTasksByAutor);

// Ruta para obtener todos las documentos por título (GET)
router.get('/tasks/titulo/:title', getTasksByTitle);

// Exporta las rutas para que puedan ser utilizadas en otros archivos
export default router;
