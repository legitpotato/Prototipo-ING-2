import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function crearPago(data) {
  return await prisma.pago.create({ data });
}

export async function obtenerPagos() {
  return prisma.pago.findMany({
    include: {
      user: {
        select: {
          rut: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });
}


export async function obtenerPagoPorId(id) {
  return prisma.pago.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });
}

export async function obtenerPagosPorEstado(estado) {
  return await prisma.pago.findMany({
    where: { estado },
    orderBy: { fecha_emision: 'desc' }
  });
}
