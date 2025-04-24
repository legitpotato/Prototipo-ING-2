

import express from 'express';           // Para crear y manejar el servidor web
import morgan from 'morgan';             // Middleware para registrar las solicitudes HTTP
import cookieParser from 'cookie-parser' // Middleware para analizar las cookies de las solicitudes
import cors from 'cors'                 // Middleware para gestionar el intercambio de recursos entre dominios (CORS)

import authRoutes from './routes/auth.routes.js'  // Importa las rutas de autenticación
import taskRoutes from './routes/tasks.routes.js' // Importa las rutas de documentos
import prestamosRoutes from './routes/prestamos.routes.js';  // Importar las rutas de préstamo

import bodyParser from 'body-parser';
import reservasRouter from './routes/reservasRoutes.js'

// Crea una instancia de la aplicación Express
const app = express();

// Configuración de CORS 
// Permite solicitudes desde el dominio 'http://localhost:5173' y acepta credenciales como cookies
app.use(cors({
    origin: 'http://localhost:5173',   // Origen permitido para las solicitudes (front-end en el puerto 5173)
    credentials: true,                  // Habilita el uso de credenciales (cookies)
}));

// Configura el middleware para registrar las solicitudes HTTP en consola en formato 'dev'
app.use(morgan('dev'));

// Middleware que permite que el servidor pueda leer y parsear cuerpos JSON en las solicitudes
app.use(express.json());

// Middleware para analizar las cookies en las solicitudes HTTP
app.use(cookieParser());

// Configura las rutas de autenticación y tareas en el prefijo '/api'
app.use('/api', authRoutes);  // Rutas para autenticación de usuarios
app.use('/api', taskRoutes);  // Rutas para gestionar tareas
app.use('/api', prestamosRoutes);  // Añadir las rutas de préstamo
app.use(bodyParser.json()); // Para recibir Json en las peticiones
app.use('/api', reservasRouter); // Rutas de reservas

// Exporta la instancia de la aplicación para usarla en otros archivos 
export default app;
