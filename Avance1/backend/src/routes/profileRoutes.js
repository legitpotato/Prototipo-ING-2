// backend/src/routes/profileRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/perfil', verifyFirebaseToken, async (req, res) => {
  const { uid } = req.firebaseUser;

  try {
    const user = await prisma.user.findUnique({ where: { uid } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
});

export default router;
