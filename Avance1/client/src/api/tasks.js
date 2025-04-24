// Importa la instancia personalizada de axios desde el archivo './axios'.
// Esta instancia ya está configurada para apuntar a la URL base 'http://localhost:4000/api'.
import axios from './axios';

// Hace solicitudes HTTP (GET, POST, PUT, DELETE) a la API para gestionar tareas.
// -----------------------------------------------------------

// Realiza una solicitud GET para obtener todas las tareas desde el endpoint '/tasks'.
export const getTasksRequest = () => axios.get('/tasks');

// Realiza una solicitud GET para obtener una tarea específica por su ID desde '/tasks/:id'.
export const getTaskRequest = (id) => axios.get(`/tasks/${id}`);

// Realiza una solicitud POST para crear una nueva tarea en el endpoint '/tasks'.
// Recibe como parámetro un objeto 'task' con los datos de la tarea a crear.
export const createTaskRequest = (task) => axios.post("/tasks", task);

// Realiza una solicitud PUT para actualizar una tarea específica en '/tasks/:id'.
// Recibe el ID de la tarea y un objeto 'task' con los datos actualizados.
export const updateTaskRequest = (id, task) => axios.put(`/tasks/${id}`, task);

// Realiza una solicitud DELETE para eliminar una tarea específica en '/tasks/:id'.
// Recibe el ID de la tarea que se desea eliminar.
export const deleteTaskRequest = (id) => axios.delete(`/tasks/${id}`);

// Realiza una solicitud GET para obtener una tarea específica por su código único desde '/tasks/cod/:cod'.
// Recibe el código de la tarea como parámetro.
export const getTaskByCodRequest = (cod) => axios.get(`/tasks/cod/${cod}`);
