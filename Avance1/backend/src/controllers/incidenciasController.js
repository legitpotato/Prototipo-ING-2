import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Crear nueva incidencia (RF6.1)
export const crearIncidencia = async (req, res) => {
  console.log('req.uid (Firebase UID):', req.uid);
  try {
    const { ubicacion, importancia, descripcion, fotos = [], comunidadId } = req.body;

    if (!ubicacion || !importancia || !descripcion || !comunidadId) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    if (!req.uid) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const usuario = await prisma.user.findUnique({
      where: { uid: req.uid },
    });

    console.log('Usuario encontrado en BD:', usuario);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const incidencia = await prisma.incidencia.create({
      data: {
        ubicacion,
        importancia,
        descripcion,
        estado: 'Nuevo',
        fotos,
        comunidadId: Number(comunidadId),
        creadorId: usuario.id,
      },
    });

    res.status(201).json(incidencia);
  } catch (error) {
    console.error("Error al crear incidencia:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const obtenerIncidenciasPorComunidad = async (req, res) => {
  try {
    const { comunidadId } = req.params;
    console.log("comunidadId recibido:", comunidadId);

    if (!comunidadId) {
      return res.status(400).json({ message: "Falta el parámetro comunidadId" });
    }

    const comunidadIdNum = Number(comunidadId);
    if (isNaN(comunidadIdNum)) {
      return res.status(400).json({ message: "comunidadId no es un número válido" });
    }

    const incidencias = await prisma.incidencia.findMany({
      where: { comunidadId: comunidadIdNum },
      include: {
        creador: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(incidencias);
  } catch (error) {
    console.error("Error al obtener incidencias:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar estado y descripción de una incidencia (RF6.2)
export const actualizarIncidencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, descripcion } = req.body;

    const incidencia = await prisma.incidencia.update({
      where: { id: Number(id) },
      data: {
        ...(estado && { estado }),
        ...(descripcion && { descripcion }),
      },
    });

    // RF6.3: Aquí podrías integrar lógica para enviar notificación de cambio

    res.json(incidencia);
  } catch (error) {
    console.error("Error al actualizar incidencia:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};