// Models/Prestamo.js 
import mongoose from 'mongoose';

// Define el esquema de préstamo
const prestamoSchema = new mongoose.Schema({
  id_user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: 'usuario'
  },
  id_libro: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task', 
    required: true
  },
  codigo_pre: {
    type: String
  },
  nombre_usuario: { 
    type: String, 
    required: true 
  },
  nombre_libro: { 
    type: String, 
    required: true 
  },
  fecha_reserva: { 
    type: Date, 
    required: true 
  },
  fecha_limite: { 
    type: Date, 
    required: true 
  },
  retraso: {
    type: Boolean,
    default: false
  },
  multa: {
    type: Number,
    default: 0
  },
  carrito: { // Nuevo campo
    type: Boolean,
    default: false // Valor predeterminado en caso de que no se proporcione
  },
}, {
  timestamps: false // Deshabilitar la creación de los campos `createdAt` y `updatedAt`
});

// Middleware para generar el código aleatorio antes de guardar
prestamoSchema.pre('save', function(next) {
  if (!this.codigo_pre) { // Solo genera el código si no está definido
    this.codigo_pre = generateRandomCode(8); // Llama a la función generadora
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

// Crea el modelo con el esquema
export default mongoose.model('Prestamo', prestamoSchema);