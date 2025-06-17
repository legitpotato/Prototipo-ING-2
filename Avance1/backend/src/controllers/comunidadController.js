import prisma from "../../prisma/client.js";

export const crearComunidad = async (req, res) => {
  try {
    const { nombre, direccion, descripcion } = req.body;

    const nuevaComunidad = await prisma.comunidad.create({
      data: {
        nombre,
        direccion,
        descripcion,
      },
    });

    res.status(201).json(nuevaComunidad);
  } catch (error) {
    console.error('Error al crear comunidad:', error);
    res.status(500).json({ error: 'Error al crear comunidad' });
  }
};

export const listarComunidades = async (req, res) => {
  try {
    const comunidades = await prisma.comunidad.findMany();
    res.status(200).json(comunidades);
  } catch (error) {
    console.error('Error al listar comunidades:', error);
    res.status(500).json({ error: 'Error al obtener comunidades' });
  }
};

export const asignarUsuarioAComunidad = async (req, res) => {
  const { id: comunidadId } = req.params;
  const { userId, rol } = req.body;

  try {
    const existente = await prisma.usuarioComunidad.findUnique({
      where: {
        userId_comunidadId: {
          userId: parseInt(userId),
          comunidadId: parseInt(comunidadId),
        },
      },
    });

    if (existente) {
      return res.status(400).json({ error: 'El usuario ya pertenece a esta comunidad.' });
    }

    const nuevaRelacion = await prisma.usuarioComunidad.create({
      data: {
        userId: parseInt(userId),
        comunidadId: parseInt(comunidadId),
        rol,
      },
    });

    res.status(201).json(nuevaRelacion);
  } catch (error) {
    console.error('Error al asignar usuario a comunidad:', error);
    res.status(500).json({ error: 'Error al asignar usuario a comunidad' });
  }
};

export const obtenerComunidadesDelUsuario = async (req, res) => {
  const { uid } = req;

  try {
    // Buscar el usuario por su UID de Firebase
    const usuario = await prisma.user.findUnique({
      where: { uid },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Buscar comunidades a las que pertenece
    const comunidades = await prisma.usuarioComunidad.findMany({
      where: { userId: usuario.id },
      include: {
        comunidad: true,
      },
    });

    // Formatear respuesta
    const resultado = comunidades.map((uc) => ({
      comunidadId: uc.comunidadId,
      nombre: uc.comunidad.nombre,
      direccion: uc.comunidad.direccion,
      rol: uc.rol,
      estado: uc.estado,
    }));

    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener comunidades del usuario:', error);
    res.status(500).json({ error: 'Error al obtener comunidades' });
  }
};

// GET /api/comunidades/:id/usuarios
export const listarUsuariosDeComunidad = async (req, res) => {
  const comunidadIdRaw = req.params.id;
  const comunidadId = parseInt(comunidadIdRaw, 10);

  if (isNaN(comunidadId)) {
    return res.status(400).json({ error: 'comunidadId inválido' });
  }

  try {
    const usuarios = await prisma.usuarioComunidad.findMany({
      where: { comunidadId },
      include: {
        user: {
          select: {
            id: true,
            uid: true,
            email: true,
            firstName: true,
            lastName: true,
            rut: true,
          },
        },
      },
    });

    res.json(usuarios);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};


// PUT /api/comunidades/:id/usuarios/:userId
export const actualizarRolUsuario = async (req, res) => {
  const comunidadIdRaw = req.params.id;
  const userIdRaw = req.params.userId;
  const { nuevoRol } = req.body;

  const comunidadId = parseInt(comunidadIdRaw, 10);
  const userId = parseInt(userIdRaw, 10);

  if (isNaN(comunidadId) || isNaN(userId)) {
    return res.status(400).json({ error: 'comunidadId o userId inválido' });
  }

  try {
    const actualizacion = await prisma.usuarioComunidad.updateMany({
      where: {
        comunidadId,
        userId,
      },
      data: {
        rol: nuevoRol,
      },
    });

    if (actualizacion.count === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado en esta comunidad' });
    }

    res.json({ mensaje: 'Rol actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
};

