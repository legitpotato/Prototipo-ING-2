import { PrismaClient } from '@prisma/client';
import { generarAnalisis } from '../../libs/gemini.js';

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
  const pagos = await prisma.pago.findMany({ where: { estado: 'pendiente' }, include: { user: true } });

  const resumen = pagos.map(p => (
    `Residente: ${p.user.firstName} ${p.user.lastName}, RUT: ${p.user.rut}, Monto: $${p.monto_original}, Vencimiento: ${p.fecha_vencimiento}`
  )).join('\n');

  const prompt = `Analiza la siguiente lista de residentes morosos y sugiere acciones para la directiva:\n${resumen}`;

  const respuestaIA = await generarAnalisis(prompt);

  res.json({ resumen, sugerencia: respuestaIA });
}
