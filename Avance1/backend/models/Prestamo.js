// Importa mongoose para trabajar con la base de datos MongoDB
import mongoose from 'mongoose';

// Define el esquema de préstamo
const prestamoSchema = new mongoose.Schema({
  // Referencia al ID del usuario que realiza el préstamo
  id_user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: 'usuario' // Valor predeterminado si no se proporciona
  },

  // Referencia al ID del libro que se está prestando
  id_libro: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task', 
    required: true // Este campo es obligatorio
  },

  // Nombre del usuario que realiza el préstamo
  nombre_usuario: { 
    type: String, 
    required: true 
  },

  // Nombre del libro que se está prestando
  nombre_libro: { 
    type: String, 
    required: true 
  },

  // Fecha en la que se realiza la reserva o préstamo
  fecha_reserva: { 
    type: Date, 
    required: true 
  },

  // Fecha límite para devolver el documento
  fecha_limite: { 
    type: Date, 
    required: true 
  },

  // Indica si el préstamo está en el carrito del usuario
  carrito: { 
    type: Boolean, 
    required: true, 
    default: false // Valor por defecto
  },

}, {
  timestamps: false // Deshabilitar la creación de los campos `createdAt` y `updatedAt`
});

// Crea el modelo Prestamo usando el esquema definido anteriormente
const Prestamo = mongoose.model('Prestamo', prestamoSchema);

// Exporta el modelo para que pueda ser utilizado en otros archivos
export default Prestamo;
