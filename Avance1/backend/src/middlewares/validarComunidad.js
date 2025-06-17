import prisma from '../../prisma/client.js';

export const validarComunidad = async (req, res, next) => {
  try {
    const uid = req.uid;
    const comunidadIdRaw = req.params.id || req.body.comunidadId || req.query.comunidadId || req.headers['x-comunidad-id'];
    const comunidadId = parseInt(comunidadIdRaw, 10);

    if (isNaN(comunidadId)) {
      return res.status(400).json({ error: 'comunidadId inválido o no proporcionado' });
    }

    // Buscar el usuario por uid
    const user = await prisma.user.findUnique({
      where: { uid },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si pertenece a la comunidad
    const relacion = await prisma.usuarioComunidad.findFirst({
      where: {
        userId: user.id,
        comunidadId: comunidadId,
        estado: 'ACTIVO',
      },
    });


    if (!relacion) {
      return res.status(403).json({ error: 'No tienes acceso a esta comunidad' });
    }

    // Adjuntar info útil al request
    req.userId = user.id;
    req.comunidadId = comunidadId;
    req.rolEnComunidad = relacion.rol;

    next();
  } catch (error) {
    console.error('Error en validarComunidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
