import { PrismaClient } from '@prisma/client';
import { generarAnalisis } from '../../libs/cohere.js';

const prisma = new PrismaClient();

// Calcula el interés acumulado y días de atraso
const calcularInteresAcumulado = (fecha_vencimiento, monto_original) => {
  const hoy = new Date();
  const fechaVenc = new Date(fecha_vencimiento);
  const diasAtraso = Math.floor((hoy - fechaVenc) / (1000 * 60 * 60 * 24));
  const interesDiario = 0.001; // 0.1% diario
  const interesAcumulado = diasAtraso > 0 ? monto_original * interesDiario * diasAtraso : 0;
  return { diasAtraso, interesAcumulado };
};

// Clasifica el nivel de riesgo
const clasificarRiesgo = (diasAtraso) => {
  if (diasAtraso <= 30) return 'leve';
  if (diasAtraso <= 90) return 'moderado';
  return 'grave';
};

// Controlador principal
export async function analizarMorosidad(req, res) {
  try {
    const pagosPendientes = await prisma.pago.findMany({
      where: { estado: 'pendiente' },
      include: { user: true },
    });

    const residentesMorosos = pagosPendientes.map((pago) => {
      const { diasAtraso, interesAcumulado } = calcularInteresAcumulado(pago.fecha_vencimiento, pago.monto_original);
      const montoTotal = pago.monto_original + interesAcumulado;
      const riesgo = clasificarRiesgo(diasAtraso);

      return {
        nombre: `${pago.user.firstName} ${pago.user.lastName}`,
        rut: pago.user.rut,
        monto_original: pago.monto_original,
        interes_acumulado: interesAcumulado,
        monto_total: montoTotal,
        fecha_vencimiento: pago.fecha_vencimiento,
        dias_atraso: diasAtraso,
        riesgo,
      };
    });

    res.status(200).json(residentesMorosos);
  } catch (error) {
    console.error('Error al analizar morosidad:', error);
    res.status(500).json({ error: 'Error al analizar morosidad', detalle: error.message });
  }
}

export async function analizarMorosidadIA(req, res) {
  try {
    const pagos = await prisma.pago.findMany({
      where: { estado: 'pendiente' },
      include: { user: true },
    });

    const resumen = pagos.map(p => {
      const fechaVenc = new Date(p.fecha_vencimiento);
      const hoy = new Date();
      const diasAtraso = Math.floor((hoy - fechaVenc) / (1000 * 60 * 60 * 24));
      const interesDiario = 0.001;
      const interesAcumulado = diasAtraso > 0 ? p.monto_original * interesDiario * diasAtraso : 0;
      const montoTotal = p.monto_original + interesAcumulado;
      const riesgo = diasAtraso <= 30 ? 'leve' : diasAtraso <= 90 ? 'moderado' : 'grave';

      return `Residente: ${p.user.firstName} ${p.user.lastName}, RUT: ${p.user.rut}, Monto original: $${p.monto_original}, Interés acumulado: $${interesAcumulado.toFixed(2)}, Monto total: $${montoTotal.toFixed(2)}, Fecha de vencimiento: ${p.fecha_vencimiento}, Días de atraso: ${diasAtraso}, Riesgo: ${riesgo}`;
    }).join('\n');

    const prompt = `Analiza el historial de pagos del siguiente residente y determina la probabilidad de que se conviertan en moroso. Considera el monto total adeudado, los días de atraso y el comportamiento general de pagos. Con base en esto, sugiere si se debe conceder la oportunidad de repactación o si se deben tomar medidas legales. El análisis debe ser conciso y directo:\n\n${resumen}`;

    const sugerencia = await generarAnalisis(prompt);

    res.json({ resumen, sugerencia });
  } catch (error) {
    console.error('Error al generar análisis con Cohere:', error);
    res.status(500).json({ error: 'Error al generar análisis con IA' });
  }
}

export async function analizarMorosidadPorRut(req, res) {
  const { rut } = req.params;

  try {
    const pagos = await prisma.pago.findMany({
      where: {
        estado: 'pendiente',
        user: { rut },
      },
      include: { user: true },
    });

    if (pagos.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron pagos pendientes para este RUT.' });
    }

    const resumen = pagos.map(p => {
      const fechaVenc = new Date(p.fecha_vencimiento);
      const hoy = new Date();
      const diasAtraso = Math.floor((hoy - fechaVenc) / (1000 * 60 * 60 * 24));
      const interesDiario = 0.001;
      const interesAcumulado = diasAtraso > 0 ? p.monto_original * interesDiario * diasAtraso : 0;
      const montoTotal = p.monto_original + interesAcumulado;
      const riesgo = diasAtraso <= 30 ? 'leve' : diasAtraso <= 90 ? 'moderado' : 'grave';

      return `Monto original: $${p.monto_original}, Interés acumulado: $${interesAcumulado.toFixed(2)}, Monto total: $${montoTotal.toFixed(2)}, Fecha de vencimiento: ${p.fecha_vencimiento}, Días de atraso: ${diasAtraso}, Riesgo: ${riesgo}`;
    }).join('\n');

    const nombre = `${pagos[0].user.firstName} ${pagos[0].user.lastName}`;
    
    const prompt = `
    Considera que una junta de vecinos desea analizar el comportamiento de los pagos de un vecino. Estas deudas se refieren a gastos comunes y otros varios que se pueden dar en el espacio de una vecindad.
    Analiza el historial de pagos del residente ${nombre} (RUT: ${rut}) con base en los siguientes datos:

    ${resumen}

    1. Evalúa el comportamiento de pago del residente.
    2. Calcula el riesgo general de morosidad (leve, moderado, grave).
    3. Sugiere una acción concreta: ¿repactación, advertencia o acción legal?
    4. Determina la probablidad de que el residente se convierta en moroso, lo siga siendo o no.
    5. Justifica brevemente tu sugerencia.

    El análisis debe ser claro, directo y no mayor a 180 palabras.
    `;

    const sugerencia = await generarAnalisis(prompt);

    res.json({ resumen, sugerencia });
  } catch (error) {
    console.error('Error al analizar morosidad por RUT:', error);
    res.status(500).json({ error: 'Error interno al generar análisis por RUT' });
  }
}

