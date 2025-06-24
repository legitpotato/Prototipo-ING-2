import prisma from '../../prisma/client.js';

/**
 * Crear un nuevo anuncio
 */
export const crearAnuncio = async (req, res) => {
  try {
    const uid = req.uid;

    // Buscar al usuario autenticado por su UID de Firebase
    const usuario = await prisma.user.findUnique({ where: { uid } });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const {
      titulo,
      contenido,
      tipoAnuncio, // 'general', 'reunion', 'recordatorio'
      permitirComentarios = true,
      permitirReacciones = true,
      soloLectura = false,
      fechaReunion,
      plataforma,
      enlaceReunion,
      comunidadId,
    } = req.body;

    // Validaciones mínimas
    if (!titulo || !contenido || !tipoAnuncio || !comunidadId) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    const nuevoAnuncio = await prisma.anuncio.create({
      data: {
        titulo,
        contenido,
        tipoAnuncio,
        permitirComentarios,
        permitirReacciones,
        soloLectura,
        fechaReunion: fechaReunion ? new Date(fechaReunion) : null,
        plataforma,
        enlaceReunion,
        comunidadId: Number(comunidadId),
        creadorId: usuario.id,
      },
    });

    res.status(201).json(nuevoAnuncio);
  } catch (err) {
    console.error('Error al crear anuncio:', err);
    res.status(500).json({ message: 'Error al crear el anuncio.' });
  }
};

/**
 * Obtener todos los anuncios por comunidad
 */
export const obtenerAnuncios = async (req, res) => {
  const { comunidadId } = req.params;

  try {
    const anuncios = await prisma.anuncio.findMany({
      where: { comunidadId: Number(comunidadId) },
      orderBy: { createdAt: 'desc' },
    });

    res.json(anuncios);
  } catch (err) {
    console.error('Error al obtener anuncios:', err);
    res.status(500).json({ message: 'Error al obtener los anuncios.' });
  }
};
