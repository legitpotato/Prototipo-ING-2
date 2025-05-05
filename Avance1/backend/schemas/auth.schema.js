// Importa 'z' desde la librería 'zod' para la validación de esquemas
import { z } from 'zod';

// Define el esquema de validación para el registro de un nuevo usuario
export const registerSchema = z.object({
    // El campo 'rut' debe ser una cadena de texto y es obligatorio
    rut: z.string({
        required_error: "Se requiere Rut",  // Mensaje de error si no se proporciona
    }),

    // El campo 'nombre' debe ser una cadena de texto y es obligatorio
    nombre: z.string({
        required_error: "Se requiere Nombre",  // Mensaje de error si no se proporciona
    }),

    // El campo 'apellido' debe ser una cadena de texto y es obligatorio
    apellido: z.string({
        required_error: "Se requiere Apellido",  // Mensaje de error si no se proporciona
    }),

    // El campo 'direccion' debe ser una cadena de texto y es obligatorio
    direccion: z.string({
        required_error: "Se requiere Direccion",  // Mensaje de error si no se proporciona
    }),

    // El campo 'correo' debe ser una cadena de texto, es obligatorio y debe tener un formato de correo válido
    correo: z.string({
        required_error: "Se requiere Direccion",  // Mensaje de error si no se proporciona
    }).email({
        message: "Correo invalido",  // Mensaje de error si el formato del correo no es válido
    }),

    // El campo 'telefono' debe ser una cadena de texto y es obligatorio
    telefono: z.string({
        required_error: "Se requiere Telefono",  // Mensaje de error si no se proporciona
    }),

    // El campo 'admin' es un valor booleano que indica si el usuario es administrador
    admin: z.boolean(),

    // El campo 'contraseña' debe ser una cadena de texto, es obligatorio y debe tener al menos 3 caracteres
    contraseña: z.string({
        required_error: "Se requiere Contraseña",  // Mensaje de error si no se proporciona
    }).min(3, {
        message: "La contraseña debe contener al menos 3 caracteres"  // Mensaje de error si la contraseña es más corta que 3 caracteres
    }),
});

// Define el esquema de validación para el inicio de sesión
export const loginSchema = z.object({
    // El campo 'correo' debe ser una cadena de texto, es obligatorio y debe tener un formato de correo válido
    correo: z.string({
        required_error: "Se requiere Correo",  // Mensaje de error si no se proporciona
    }).email({
        message: "Correo no valido",  // Mensaje de error si el formato del correo no es válido
    }),

    // El campo 'contraseña' debe ser una cadena de texto, es obligatorio y debe tener al menos 3 caracteres
    contraseña: z.string({
        required_error: "Se requiere Contraseña",  // Mensaje de error si no se proporciona
    }).min(3, {
        message: "La contraseña debe contener al menos 3 caracteres"  // Mensaje de error si la contraseña es más corta que 3 caracteres
    }),
});
