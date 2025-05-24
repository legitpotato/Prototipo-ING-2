import { crearPago, obtenerPagos, obtenerPagoPorId, obtenerPagosPorEstado } from '../../models/pagoModel.js';

export async function crearPagoController(req, res) {
  const {
    descripcion,
    fecha_emision,
    fecha_vencimiento,
    monto_original,
    interes_acumulado = 0,
    cuenta_destino
  } = req.body;

  if (
    !descripcion ||
    !fecha_emision ||
    !fecha_vencimiento ||
    !monto_original ||
    interes_acumulado === undefined ||
    !cuenta_destino
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
      cuenta_destino
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
    const pagos = await obtenerPagos();
    return res.status(200).json(pagos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los pagos', detalle: error.message });
  }
}

export async function obtenerPagoPorIdController(req, res) {
  const { id } = req.params;
  try {
    const pago = await obtenerPagoPorId(id);
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
