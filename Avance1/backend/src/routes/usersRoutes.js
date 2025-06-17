import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';

const router = express.Router();
const prisma = new PrismaClient();

// Ruta para registrar usuario
router.post('/usuarios', verifyFirebaseToken, async (req, res) => {
  const { uid, email } = req.firebaseUser;
  const { rut, firstName, lastName, birthDate } = req.body;

  try {
    // Convertir fecha de "DD/MM/YYYY" a Date
    const [day, month, year] = birthDate.split('/');
    const formattedDate = new Date(`${year}-${month}-${day}`);

    const existingUser = await prisma.user.findUnique({ where: { uid } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    const user = await prisma.user.create({
      data: {
        uid,
        email,
        rut,
        firstName,
        lastName,
        birthDate: formattedDate,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
  console.log("Datos recibidos:", req.body);
  console.log("Usuario Firebase:", req.firebaseUser);
});

// Ruta GET para verificar si existe un usuario por RUT
router.get('/usuarios/verificar/:rut', async (req, res) => {
  const { rut } = req.params;

  if (!rut) {
    return res.status(400).json({ message: 'Debe proporcionar el RUT' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { rut },
    });

    if (user) {
      return res.status(200).json({ exists: true, user });
    } else {
      return res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error('Error al verificar usuario por RUT:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
