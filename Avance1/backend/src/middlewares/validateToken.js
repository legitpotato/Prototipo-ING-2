import jwt from 'jsonwebtoken';  // Importa la librería jwt para manejar tokens
import { TOKEN_SECRET } from '../config.js';  // Importa el secreto del token desde la configuración

// Middleware para verificar que el usuario esté autenticado
export const authRequired = (req, res, next) => {
    const { token } = req.cookies;  // Obtiene el token desde las cookies de la solicitud

    // Si no hay un token, devolver un error 401 (No autorizado)
    if (!token) 
        return res.status(401).json({ message: "No token, autorización rechazada" });

    // Verificar que el token sea válido usando el TOKEN_SECRET para la firma
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) {
            // Si el token es inválido, devolver un error 403 (Prohibido)
            return res.status(403).json({ message: "Token inválido" });
        }

        // Si el token es válido, agregar la información del usuario al objeto `req`
        req.user = user;

        // Continuar con el siguiente middleware o controlador
        next();
    });
};
