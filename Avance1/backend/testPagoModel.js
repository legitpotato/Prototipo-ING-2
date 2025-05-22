console.log('Inicio del test de pagos');
import { crearPago, obtenerPagos, obtenerPagoPorId } from './models/pagoModel.js';

async function test() {
  try {
    // Crear un pago nuevo
    const nuevoPago = await crearPago({
      descripcion: 'Cuota mensual de mayo',
      fecha_emision: '2025-05-22',
      fecha_vencimiento: '2025-06-05',
      monto_original: 100.00,
      interes_acumulado: 0,
      monto_total: 100.00,
      cuenta_destino: 'Banco XYZ - 1234567890',
    });

    console.log('Pago creado:', nuevoPago);

    // Obtener todos los pagos
    const pagos = await obtenerPagos();
    console.log('Listado de pagos:', pagos);

    // Obtener pago por ID
    const pagoId = nuevoPago.id;
    const pagoBuscado = await obtenerPagoPorId(pagoId);
    console.log('Pago buscado por ID:', pagoBuscado);

  } catch (error) {
    console.error('Error en pruebas:', error);
  }
}

test();
