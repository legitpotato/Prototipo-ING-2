import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function crearPago(data) {
  return await prisma.pago.create({ data });
}

export async function obtenerPagos() {
  return await prisma.pago.findMany({
    orderBy: { fecha_emision: 'desc' }
  });
}

export async function obtenerPagoPorId(id) {
  return await prisma.pago.findUnique({
    where: { id: parseInt(id) }
  });
}

export async function obtenerPagosPorEstado(estado) {
  return await prisma.pago.findMany({
    where: { estado },
    orderBy: { fecha_emision: 'desc' }
  });
}
