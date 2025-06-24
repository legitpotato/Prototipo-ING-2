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

// GET /api/anuncios/comunidad/:comunidadId/ultimos
router.get('/comunidad/:comunidadId/ultimos', async (req, res) => {
  try {
    const { comunidadId } = req.params;
    const ultimos = await prisma.anuncio.findMany({
      where: { comunidadId: parseInt(comunidadId) },
      orderBy: { createdAt: 'desc' },
      take: 2,
    });
    res.json(ultimos);
  } catch (error) {
    console.error('Error al obtener los últimos anuncios:', error);
    res.status(500).json({ message: 'Error al obtener los últimos anuncios.' });
  }
});


export default router;
