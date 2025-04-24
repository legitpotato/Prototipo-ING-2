// Importa 'z' desde la librería 'zod' para la validación de esquemas
import { z } from 'zod';

// Define el esquema de validación para la creación de una nueva documento
export const createTaskSchema = z.object({

    // El campo 'title' debe ser una cadena de texto y es obligatorio
    title: z.string({
        required_error: 'El titulo es requerido',  // Mensaje de error si no se proporciona
    }),

    // El campo 'autor' debe ser una cadena de texto y es obligatorio
    autor: z.string({
        required_error: 'El autor es requerido',  // Mensaje de error si no se proporciona
    }),

    // El campo 'tipodoc' debe ser una cadena de texto y es obligatorio
    tipodoc: z.string({
        required_error: 'El tipo de documento es requerido',  // Mensaje de error si no se proporciona
    }),

    // El campo 'categoria' debe ser una cadena de texto y es obligatorio
    categoria: z.string({
        required_error: 'La categoria es requerida',  // Mensaje de error si no se proporciona
    }),

    // El campo 'editorial' debe ser una cadena de texto y es obligatorio
    editorial: z.string({
        required_error: 'La editorial es requerido',  // Mensaje de error si no se proporciona
    }),

    // El campo 'edicion' debe ser una cadena de texto y es obligatorio
    edicion: z.string({
        required_error: 'La edición es requerido',  // Mensaje de error si no se proporciona
    }),

    // El campo 'anoedicion' debe ser una cadena de texto y es obligatorio
    anoedicion: z.string({
        required_error: 'El año de edición es requerido',  // Mensaje de error si no se proporciona
    }),

    // El campo 'ubicacion' debe ser una cadena de texto y es obligatorio
    ubicacion: z.string({
        required_error: "La ubicación de estantería es requerido",  // Mensaje de error si no se proporciona
    }),

    // El campo 'resumen' debe ser una cadena de texto y es obligatorio
    resumen: z.string({
        required_error: "El resumen es requerido",  // Mensaje de error si no se proporciona
    }),

    // El campo 'imgURL' debe ser una cadena de texto y es obligatorio
    imgURL: z.string({
        required_error: "La imagen del documento es requerida",  // Mensaje de error si no se proporciona
    }),

    // El campo 'date' es opcional, pero si se proporciona debe ser una cadena con formato de fecha y hora
    date: z.string().datetime().optional(),
});
