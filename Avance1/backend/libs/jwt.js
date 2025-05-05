import jwt from 'jsonwebtoken';  // Importar la librería jsonwebtoken para trabajar con JWT (JSON Web Tokens)
import { TOKEN_SECRET } from "../config.js";  // Importar la clave secreta para firmar el token desde el archivo de configuración

// Función para crear un token de acceso
export function createAccessToken(payload) {
    // Retornar una promesa que generará el token
    return new Promise((resolve, reject) => {
        // Utilizar el método 'sign' de la librería jsonwebtoken para crear el token
        jwt.sign(  
            payload,  // El 'payload' que contiene la información que será almacenada en el token
            TOKEN_SECRET,  // La clave secreta utilizada para firmar el token (importada desde config.js)
            {
                expiresIn: "1d",  // El token expirará en 1 día (24 horas)
            },
            (err, token) => {
                if (err) reject(err);  // Si ocurre un error, rechazar la promesa con el error
                resolve(token);  // Si el token se genera correctamente, resolver la promesa con el token generado
            }
        );
    });
}
