import { crearPago, obtenerPagos, obtenerPagoPorId, obtenerPagosPorEstado } from '../../models/pagoModel.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function crearPagoController(req, res) {
  const {
    descripcion,
    fecha_emision,
    fecha_vencimiento,
    monto_original,
    interes_acumulado = 0,
    cuenta_destino,
    rut // <-- asegurarte que venga en el body para relacionar el pago con un usuario
  } = req.body;

  if (
    !descripcion ||
    !fecha_emision ||
    !fecha_vencimiento ||
    !monto_original ||
    interes_acumulado === undefined ||
    !cuenta_destino ||
    !rut  // <--- validar también que venga el rut
  ) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const monto_total = parseFloat(monto_original) + parseFloat(interes_acumulado);

  try {
    const nuevoPago = await crearPago({
      descripcion,
      fecha_emision,
      fecha_vencimiento,
      monto_original: parseFloat(monto_original),
      interes_acumulado: parseFloat(interes_acumulado),
      monto_total,
      cuenta_destino,
      rut // <--- agregar aquí para relacionar con el usuario
    });

    return res.status(201).json({
      message: 'Pago creado correctamente',
      pago: nuevoPago
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear el pago', detalle: error.message });
  }
}


export async function obtenerPagosController(req, res) {
  try {
    const firebaseUid = req.firebaseUser.uid;

    // Buscar el usuario por su UID de Firebase
    const usuario = await prisma.user.findUnique({
      where: { uid: firebaseUid },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado en la base de datos' });
    }

    // Filtrar pagos por el rut del usuario autenticado
    const pagos = await prisma.pago.findMany({
      where: { rut: usuario.rut },
      orderBy: { fecha_emision: 'desc' },
    });

    return res.status(200).json(pagos);
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    return res.status(500).json({ error: 'Error al obtener los pagos', detalle: error.message });
  }
}

export async function obtenerPagoPorIdController(req, res) {
  const { id } = req.params;
  try {
    const pago = await obtenerPagoPorId(id);
    console.log('🧾 Pago con usuario incluido:', pago); // <-- esto

    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    return res.status(200).json(pago);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el pago', detalle: error.message });
  }
}


export async function obtenerPagosPendientesController(req, res) {
  try {
    const pagos = await obtenerPagosPorEstado('pendiente');
    return res.status(200).json(pagos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener pagos pendientes', detalle: error.message });
  }
}

export async function obtenerPagosPagadosController(req, res) {
  try {
    const pagos = await obtenerPagosPorEstado('pagado');
    return res.status(200).json(pagos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener pagos pagados', detalle: error.message });
  }
}

export const marcarPagoComoPagadoController = async (req, res) => {
  const { id } = req.params;

  try {
    const pagoActualizado = await prisma.pago.update({
      where: { id: parseInt(id) },
      data: {
        estado: 'pagado',
        updatedAt: new Date()
      },
    });

    res.json(pagoActualizado);

  } catch (error) {
    console.error("Error al actualizar el pago:", error);  // 👈 importante
    res.status(500).json({ mensaje: 'Error al actualizar el pago' });
  }
};

export const obtenerTodoPagosController = async (req, res) => {
  try {
    const pagos = await prisma.pago.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        fecha_emision: 'desc'
      }
    });

    res.json(pagos);
  } catch (error) {
    console.error('Error al obtener todos los pagos:', error);
    res.status(500).json({ error: 'Error al obtener los pagos' });
  }
};