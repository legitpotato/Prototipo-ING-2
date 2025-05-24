import React from 'react';

export default function PagDetalles({ pago }) {
  const formatMonto = (monto) => (typeof monto === 'number' ? monto.toFixed(2) : '0.00');

  const pStyle = {
    marginBottom: '12px', // más espacio entre cada línea
    fontSize: '16px',     // tamaño legible
  };

  return (
    <div>
      <p style={pStyle}><strong>Descripción:</strong> {pago.descripcion || 'N/A'}</p>
      <p style={pStyle}><strong>Fecha de emisión:</strong> {pago.fecha_emision || 'N/A'}</p>
      <p style={pStyle}><strong>Fecha de vencimiento:</strong> {pago.fecha_vencimiento || 'N/A'}</p>
      <p style={pStyle}><strong>Monto original:</strong> ${formatMonto(pago.monto_original)}</p>
      <p style={pStyle}><strong>Interés acumulado:</strong> ${formatMonto(pago.interes_acumulado)}</p>
      <p style={pStyle}><strong>Monto total:</strong> ${formatMonto(pago.monto_total)}</p>
      <p style={pStyle}><strong>Cuenta destino:</strong> {pago.cuenta_destino || 'N/A'}</p>
      <p style={pStyle}><strong>Estado:</strong> {pago.estado || 'N/A'}</p>
    </div>
  );
}
