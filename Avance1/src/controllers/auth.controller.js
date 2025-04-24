import User from "../models/user.model.js"; // Importa el modelo de usuario desde el archivo 'user.model.js'
import bcrypt from 'bcryptjs'; // Importa bcryptjs para manejar el hashing de contraseñas
import { createAccessToken } from "../libs/jwt.js"; // Importa la función para crear tokens de acceso
import jwt from "jsonwebtoken"; // Importa la librería jsonwebtoken para verificar y generar tokens
import { TOKEN_SECRET } from "../config.js"; // Importa la clave secreta para JWT desde la configuración
import sendMail from "../services/mailer.js";

// Registrar un usuario en la base de datos
export const register = async (req, res) => {
    const { rut, nombre, apellido, direccion, correo, telefono, contraseña } = req.body;

    try {
        // Verifica si el correo ya está en uso
        const userFound = await User.findOne({ correo });
        if (userFound) return res.status(400).json(["Este correo ya está en uso"]);

        // Hashea la contraseña antes de almacenarla
        const passwordHash = await bcrypt.hash(contraseña, 10);

        // Crea un nuevo usuario con los datos proporcionados
        const newUser = new User({
            rut,
            nombre,
            apellido,
            direccion,
            correo,
            telefono,
            admin: false, // El usuario es asignado como no administrador por defecto
            contraseña: passwordHash,
        });

        // Guarda el nuevo usuario en la base de datos
        const userSaved = await newUser.save();

        // Crea un token de acceso con el ID del nuevo usuario
        const token = await createAccessToken({ id: userSaved._id });

        // Establece el token como una cookie en la respuesta
        res.cookie('token', token);

        // Responde con los datos del usuario guardado
        res.json({
            id: userSaved._id,
            rut: userSaved.rut,
            nombre: userSaved.nombre,
            apellido: userSaved.apellido,
            direccion: userSaved.direccion,
            correo: userSaved.correo,
            telefono: userSaved.telefono,
            admin: userSaved.admin,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        });
    } catch (error) {
        // Si hay algún error, devuelve un mensaje con el error
        res.status(500).json({ message: error.message });
    }

    // Enviar correo de bienvenida
        try {
            await sendMail(
                "karli72@ethereal.email", //Cambia este parametro con el correo que te da la pagina descrita en "mailer.js"
            );
            console.log('Correo de bienvenida enviado con éxito.');
        } catch (emailError) {
            console.error('Error al enviar el correo:', emailError);
        };
};

// Inicio de sesión
export const login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Si el usuario no está en la base de datos, se mostrará esto por pantalla
        const userFound = await User.findOne({ correo });
        if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

        // Si la contraseña no coincide, se mostrará este mensaje por pantalla
        const isMatch = await bcrypt.compare(contraseña, userFound.contraseña);
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

        // Crear un token de acceso basado en el ID de un usuario
        const token = await createAccessToken({ id: userFound._id });

        // Establecer el token como una cookie en la respuesta
        res.cookie('token',token);

        // Enviar la respuesta con la información del usuario
        res.json({
            id: userFound._id,
            rut: userFound.rut,
            nombre: userFound.nombre,
            apellido: userFound.apellido,
            direccion: userFound.direccion,
            correo: userFound.correo,
            telefono: userFound.telefono,
            admin: userFound.admin,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });
    } catch (error) {
        // Si hay algún error, devuelve un mensaje con el error
        res.status(500).json({ message: error.message });
    }
};


//Cierre de sesion
//Establece la cookie 'token' con un valor vacío ("") y una fecha de expiración en el pasado (new Date(0)), lo que efectivamente la borra.
export const logout = (req, res) => {
    // Borra el token de la cookie, lo que efectivamente cierra la sesión
    res.cookie('token', "", {
        expires: new Date(0) // La fecha de expiración se establece en 0 para borrar la cookie
    });
    return res.sendStatus(200); // Responde con un estado 200 OK
};

// Obtener perfil del usuario
export const profile = async (req, res) => {
    // Busca al usuario por ID usando el token de acceso
    const userFound = await User.findById(req.user.id);
    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    // Devuelve los datos del usuario encontrado
    return res.json({
        id: userFound._id,
        rut: userFound.rut,
        nombre: userFound.nombre,
        apellido: userFound.apellido,
        direccion: userFound.direccion,
        correo: userFound.correo,
        telefono: userFound.telefono,
        admin: userFound.admin,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
    });
};

// Verificar token
export const verifyToken = async (req, res) => {
    const { token } = req.cookies; // Obtiene el token de las cookies

    if (!token) return res.status(401).json({ message: "Unauthorized1" }); // Si no hay token, se devuelve un error de no autorizado

    // Verifica el token usando la clave secreta
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "Unauthorized2" });

        // Busca al usuario en la base de datos usando el ID del token
        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({ message: "Unauthorized3" });

        // Si el token es válido, devuelve los datos del usuario
        return res.json({
            id: userFound._id,
            rut: userFound.rut,
            nombre: userFound.nombre,
            apellido: userFound.apellido,
            direccion: userFound.direccion,
            correo: userFound.correo,
            telefono: userFound.telefono,
            admin: userFound.admin,
        });
    });
};

// Eliminar un usuario por ID
export const deleteUser = async (req, res) => {
    const { id } = req.params; // El ID del usuario a eliminar se pasa como parámetro

    try {
        // Verifica si el usuario existe
        const userFound = await User.findById(id);
        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Elimina el usuario de la base de datos
        await User.findByIdAndDelete(id);

        // Responde con un mensaje de éxito
        return res.json({ message: "Usuario eliminado correctamente" });

    } catch (error) {
        // Si hay un error, responde con el mensaje de error
        res.status(500).json({ message: error.message });
    }
};

// Eliminar el último usuario agregado
export const deleteLastUser = async (req, res) => {
    try {
        // Encuentra al último usuario agregado
        const lastUser = await User.findOne().sort({ createdAt: -1 });

        if (!lastUser) {
            return res.status(404).json({ message: "No hay usuarios registrados" });
        }

        // Elimina al último usuario
        await User.findByIdAndDelete(lastUser._id);

        // Responde con un mensaje de éxito y los datos del usuario eliminado
        return res.json({
            message: "Último usuario eliminado correctamente",
            user: {
                id: lastUser._id,
                rut: lastUser.rut,
                nombre: lastUser.nombre,
                correo: lastUser.correo,
                createdAt: lastUser.createdAt,
            },
        });

    } catch (error) {
        // Si ocurre un error, responde con el mensaje de error
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    const { id } = req.params; // ID del usuario a modificar
    const updateData = req.body; // Datos a actualizar

    try {
        // Busca y actualiza el usuario en la base de datos
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // Retorna el usuario actualizado y valida los datos
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Responde con un mensaje de éxito y los datos del usuario actualizado
        return res.json({
            message: "Usuario actualizado correctamente",
            user: updatedUser,
        });

    } catch (error) {
        // Si hay un error, responde con el mensaje de error
        res.status(500).json({ message: error.message });
    }
};
