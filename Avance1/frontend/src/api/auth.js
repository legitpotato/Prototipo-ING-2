// Importa una instancia personalizada de axios desde el archivo './axios'.
// Esta instancia puede tener configuraciones predefinidas como headers o baseURL.
import axios from './axios';

// Define la URL base de la API que se utilizará para las solicitudes HTTP.
const API = 'http://localhost:4000/api';

// Llama algunas funciones desde la base de datos para ser usadas en el cliente
// -----------------------------------------------------------

// Envía una solicitud POST al endpoint '/register' para registrar un nuevo usuario.
// Recibe como parámetro un objeto 'user' que contiene la información del usuario a registrar.
export const registerRequest = (user) => axios.post(`/register`, user);

// Envía una solicitud POST al endpoint '/login' para autenticar un usuario.
// Recibe como parámetro un objeto 'user' con las credenciales de inicio de sesión.
export const loginRequest = user => axios.post(`/login`, user);

// Envía una solicitud GET al endpoint '/verify' para verificar la validez de un token.
// Esta función puede usarse para comprobar si un usuario sigue autenticado.
export const verityTokenRequest = () => axios.get(`/verify`);
