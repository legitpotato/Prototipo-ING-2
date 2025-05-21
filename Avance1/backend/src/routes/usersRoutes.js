import express from 'express';
import { PrismaClient } from '@prisma/client';
import admin from '../../libs/firebase-admin.js';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware para verificar el token de Firebase
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

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


export default router;
