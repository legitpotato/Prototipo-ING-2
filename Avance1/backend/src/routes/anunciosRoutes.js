import express from 'express';
import { crearAnuncio, obtenerAnuncios } from '../controllers/anunciosController.js';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';
import prisma from '../../prisma/client.js';

const router = express.Router();

// 🔐 Crear anuncio (solo para usuarios autenticados y registrados en BD)
router.post('/', verifyFirebaseToken, crearAnuncio);

// 🔍 Obtener todos los anuncios por comunidad
router.get('/:comunidadId', verifyFirebaseToken, async (req, res) => {
  try {
    const { comunidadId } = req.params;

    const anuncios = await prisma.anuncio.findMany({
      where: { comunidadId: Number(comunidadId) },
      orderBy: { createdAt: 'desc' },
    });

    res.json(anuncios);
  } catch (error) {
    console.error('❌ Error al obtener anuncios:', error);
    res.status(500).json({ message: 'Error al obtener los anuncios.' });
  }
});


export default router;
