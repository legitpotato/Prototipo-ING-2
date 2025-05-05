// Función middleware para validar el esquema de los datos de la solicitud
export const validateSchema = (schema) => (req, res, next) => {
    try {
        // Intenta validar el cuerpo de la solicitud (req.body) con el esquema proporcionado
        schema.parse(req.body);
        
        // Si la validación es exitosa, continúa con el siguiente middleware o controlador
        next();
    } catch (error) {
        // Si la validación falla, responde con un error 400 (Bad Request)
        // y devuelve los mensajes de error generados por la validación
        return res.status(400).json(error.errors.map(error => error.message));
    }
};
