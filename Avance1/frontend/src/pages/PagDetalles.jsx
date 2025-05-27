import React from 'react';

export default function PagDetalles({ pago }) {
  const formatMonto = (monto) => (typeof monto === 'number' ? monto.toFixed(2) : '0.00');

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  const botonBase = "mt-5 px-6 py-2 rounded-lg text-white font-semibold";

  return (
    <div className="space-y-3 text-base text-gray-800">
      <p><strong>Descripción:</strong> {pago.descripcion || 'N/A'}</p>
      <p><strong>Fecha de emisión:</strong> {formatearFecha(pago.fecha_emision)}</p>
      <p><strong>Fecha de vencimiento:</strong> {formatearFecha(pago.fecha_vencimiento)}</p>
      <p><strong>Monto original:</strong> ${formatMonto(pago.monto_original)}</p>
      <p><strong>Interés acumulado:</strong> ${formatMonto(pago.interes_acumulado)}</p>
      <p><strong>Monto total:</strong> ${formatMonto(pago.monto_total)}</p>
      <p><strong>Cuenta destino:</strong> {pago.cuenta_destino || 'N/A'}</p>
      <p><strong>Estado:</strong> {pago.estado || 'N/A'}</p>

    </div>
  );
}
