// Importa mongoose para trabajar con la base de datos MongoDB
import mongoose from "mongoose";

// Definición del esquema para el modelo 'User' (Usuario)
const userSchema = new mongoose.Schema({
    // RUT del usuario (identificador único)
    rut: {
        type: String,  // El tipo de datos es cadena de texto
        require: true, // Este campo es obligatorio
        trim: true,    // Elimina los espacios en blanco al principio y al final
    },
    
    // Nombre del usuario
    nombre: {
        type: String,  // El tipo de datos es cadena de texto
        require: true, // Este campo es obligatorio
        trim: true,    // Elimina los espacios en blanco al principio y al final
    },

    // Apellido del usuario
    apellido: {
        type: String,  // El tipo de datos es cadena de texto
        require: true, // Este campo es obligatorio
        trim: true,    // Elimina los espacios en blanco al principio y al final
    },

    // Dirección del usuario (puede ser una dirección física)
    direccion: {
        type: String,  // El tipo de datos es cadena de texto
        require: true, // Este campo es obligatorio
        trim: true,    // Elimina los espacios en blanco al principio y al final
    },

    // Correo electrónico del usuario
    correo: {
        type: String,  // El tipo de datos es cadena de texto
        require: true, // Este campo es obligatorio
        trim: true,    // Elimina los espacios en blanco al principio y al final
        unique: true,  // Este campo debe ser único en la base de datos (no se pueden repetir correos)
    },

    // Teléfono del usuario
    telefono: {
        type: String,  // El tipo de datos es cadena de texto
        require: true, // Este campo es obligatorio
        trim: true,    // Elimina los espacios en blanco al principio y al final
    },

    // Contraseña del usuario (encriptada antes de ser guardada en la base de datos)
    contraseña: {
        type: String,  // El tipo de datos es cadena de texto
        require: true, // Este campo es obligatorio
    },

    // Campo que indica si el usuario es administrador
    admin: {
        type: Boolean,    // El tipo de datos es booleano (true o false)
        default: false,   // Los usuarios serán clientes por defecto (no administradores)
    },
}, {
    timestamps: true  // Añade automáticamente los campos 'createdAt' y 'updatedAt' al documento
});

// Crea y exporta el modelo 'User' usando el esquema 'userSchema'
export default mongoose.model('User', userSchema);
