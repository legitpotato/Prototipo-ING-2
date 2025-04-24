// Importa mongoose para trabajar con la base de datos MongoDB
import mongoose from "mongoose";


// Definición del esquema de documento (Task), que define la estructura de un documento de tarea en la base de datos
const taskSchema = new mongoose.Schema({
    // Código único para identificar el documento, como un código de libro o documento
    cod: {
        type: String
    },

    // Título del documento
    title: {
        type: String,
        required: true,  // El campo es obligatorio
        trim: true,      // Elimina espacios en blanco al principio y al final
    },

    // Autor del documento 
    autor: {
        type: String,
        required: true,  // El campo es obligatorio
        trim: true,      // Elimina espacios en blanco al principio y al final
    },

    // Tipo de documento (puede ser libro, artículo, etc.)
    tipodoc: {
        type: String,
        required: true,  // El campo es obligatorio
    },

    // Categoría o clasificación del documento
    categoria: {
        type: String,
        required: true,  // El campo es obligatorio
    },

    // Editorial del documento
    editorial: {
        type: String,
        required: true,  // El campo es obligatorio
        trim: true,      // Elimina espacios en blanco al principio y al final
    },

    // Edición del documento
    edicion: {
        type: String,
        required: true,  // El campo es obligatorio
        trim: true,      // Elimina espacios en blanco al principio y al final
    },

    // Año de edición del documento
    anoedicion: {
        type: String,
        required: true,  // El campo es obligatorio
    },

    // Ubicación del documento 
    ubicacion: {
        type: String,
        required: true,  // El campo es obligatorio
        trim: true,      // Elimina espacios en blanco al principio y al final
    },

    // Cantidad de copias disponibles del documento
    cantidad: {
        type: Number,
        required: true,  // El campo es obligatorio
    },

    // Historial de reservas (cantidad de veces que el documento ha sido reservado)
    reserva_hist: {
        type: Number,
        required: true,  // El campo es obligatorio
    },

    // Resumen del documento
    resumen: {
        type: String,
        required: true,  // El campo es obligatorio
    },

    // URL de la imagen representativa del documento (como una portada)
    imgURL: {
        type: String,
        required: true,  // El campo es obligatorio
    },

    // Fecha de creación de la tarea (se asigna automáticamente si no se proporciona)
    date: {
        type: Date,
        default: Date.now,  // Por defecto, la fecha será la actual
    },

    // Referencia al usuario que creó o está asociado con la tarea (relación con el modelo User)
    user: {
        type: mongoose.Schema.Types.ObjectId,  // Tipo de datos de referencia a otro documento
        ref: 'User',  // Hace referencia al modelo 'User' en la base de datos
        required: true,  // El campo es obligatorio
    },
},
{
    timestamps: true  // Añade campos 'createdAt' y 'updatedAt' automáticamente
});

// Middleware para generar el código aleatorio antes de guardar
taskSchema.pre('save', function(next) {
    if (!this.cod) { // Solo genera el código si no está definido
      this.cod = generateRandomCode(8); // Llama a la función generadora
    }
    next();
  });
  
  // Función para generar un código alfanumérico aleatorio
  function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

// Crea y exporta el modelo 'Task' usando el esquema 'taskSchema'
export default mongoose.model("Task", taskSchema);
