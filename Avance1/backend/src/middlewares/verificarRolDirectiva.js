// middlewares/verificarRolDirectiva.js
export const verificarRolDirectiva = (req, res, next) => {
  const rol = req.rolEnComunidad;

  if (rol === 'ADMIN' || rol === 'DIRECTIVA') {
    return next();
  }

  return res.status(403).json({ error: 'No tienes permisos para esta acción' });
};
