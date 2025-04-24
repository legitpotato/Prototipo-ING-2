// Middleware para verificar si el usuario es administrador
export const isAdmin = (req, res, next) => {
    // Verificar si el usuario está autenticado y tiene privilegios de administrador
    if (req.user && req.user.admin) {
        return next();  // Si es administrador, continuar con la siguiente función (enrutador o middleware)
    } else {
        // Si no es administrador, devolver un error 403 (Prohibido) con un mensaje
        return res.status(403).json({ message: "Acceso denegado. Solo administradores pueden realizar esta acción." });
    }
};
