import { createContext, useContext, useState } from "react";
// Importa funciones para interactuar con la API de tareas
import { createTaskRequest, getTasksRequest, deleteTaskRequest, getTaskRequest, updateTaskRequest, getTaskByCodRequest } from "../api/tasks";

// Crea un contexto para gestionar las tareas
const TaskContext = createContext();

// Hook personalizado para acceder al contexto de tareas
export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTasks must be used within a TaskProvider");
    }
    return context;
}

// Proveedor del contexto de tareas
export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]); // Estado que almacena la lista de tareas

    // Función para obtener todas las tareas
    const getTasks = async () => {
        try {
            const res = await getTasksRequest(); // Llama a la API para obtener las tareas
            setTasks(res.data); // Actualiza el estado con las tareas obtenidas
        } catch (error) {
            console.error("Error en conseguir documentos:", error);
        }
    };

    // Función para crear una nueva tarea
    const createTask = async (task) => {
        try {
            const res = await createTaskRequest(task); // Llama a la API para crear una tarea
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    };

    // Función para eliminar una tarea por su ID
    const deleteTask = async (id) => {
        try {
           const res = await deleteTaskRequest(id); // Llama a la API para eliminar la tarea
           if (res.status == 204) {
               setTasks(tasks.filter((task) => task._id !== id)); // Elimina la tarea del estado local si la eliminación fue exitosa
           }
        } catch (error) {
            console.log(error);
        }
    };

    // Función para obtener una tarea específica por su ID
    const getTask = async (id) => {
        try {
            const res = await getTaskRequest(id); // Llama a la API para obtener una tarea específica
            return res.data; // Devuelve la tarea obtenida
        } catch (error) {
            console.error(error);
        }
    };

    // Función para actualizar una tarea por su ID
    const updateTask = async (id, task) => {
        try {
          await updateTaskRequest(id, task); // Llama a la API para actualizar la tarea
        } catch (error) {
          console.error(error);
        }
    };

    // Función para obtener una tarea por su código
    const getTaskByCod = async (cod) => {
        try {
            const response = await getTaskByCodRequest(cod); // Llama a la API para obtener la tarea por código
            return response.data; // Devuelve la tarea encontrada
        } catch (error) {
            console.error(error);
            throw new Error('Documento no encontrado.'); // Lanza un error si no encuentra la tarea
        }
    };

    // Proveedor del contexto con las funciones y el estado compartido
    return (
        <TaskContext.Provider 
            value={{ 
                tasks,
                createTask,
                getTasks,
                deleteTask,
                getTask,
                updateTask,
                getTaskByCod,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}
