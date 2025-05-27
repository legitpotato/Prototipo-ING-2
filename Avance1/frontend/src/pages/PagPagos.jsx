import React, { useEffect, useState } from 'react';
import PagoDetalle from './PagDetalles';
import ComprobantePago from '../components/Comprobante.jsx';

export default function PagPagos() {
  const [pagos, setPagos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/pagos')
      .then(res => {
        if (!res.ok) throw new Error(`Error en la API: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setPagos(data);
        else {
          console.error("Error: La respuesta de pagos no es un array", data);
          setPagos([]);
        }
      })
      .catch(err => console.error("Error fetching pagos:", err));
  }, []);

  const pagosFiltrados = pagos.filter(pago => {
    if (filtro === 'todos') return true;
    return pago.estado === filtro;
  });

  const marcarPagoComoPagado = async (id) => {
  try {
    const res = await fetch(`http://localhost:4000/api/pagos/${id}/pagar`, {
      method: 'PATCH',
    });

    if (!res.ok) throw new Error('Error al actualizar el pago');

    const pagoActualizado = await res.json();

    // Actualiza la lista de pagos
    setPagos(prevPagos =>
      prevPagos.map(p =>
        p.id === id ? { ...p, estado: pagoActualizado.estado } : p
      )
    );

    // También actualiza el pago seleccionado si corresponde
    setPagoSeleccionado(prev =>
      prev && prev.id === id ? { ...prev, estado: pagoActualizado.estado } : prev
    );

    alert('¡Pago realizado con éxito!');
  } catch (err) {
    console.error(err);
    alert('Hubo un error al intentar pagar');
  }
};

  return (
    <div className="p-5 text-black">
      <h1 className="text-4xl text-indigo-500 font-bold mt-12 font-mono text-center">Sección de Pagos</h1>

      {!pagoSeleccionado && (
        <>
          <div className="flex justify-end items-center mb-5">
            <label htmlFor="filtro" className="mr-2">Filtrar por estado:</label>
            <select
              id="filtro"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className="px-3 py-2 text-base border rounded"
            >
              <option value="todos">Todos</option>
              <option value="pagado">Pagados</option>
              <option value="pendiente">Pendientes</option>
            </select>
          </div>

          <table className="w-full border-collapse font-base">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-3 text-left">Descripción</th>
                <th className="border px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.map(pago => (
                <tr
                  key={pago.id}
                  className="cursor-pointer hover:bg-indigo-100 transition-colors"
                  onClick={() => setPagoSeleccionado(pago)}
                >
                  <td className="border px-4 py-2">{pago.descripcion}</td>
                  <td className="border px-4 py-2">{pago.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {pagoSeleccionado && (
        <div className="mt-8 p-6 border border-gray-300 rounded-lg max-w-2xl mx-auto bg-white shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Detalles del pago</h2>
          <PagoDetalle pago={pagoSeleccionado} />

          <div className="flex justify-end mt-8 gap-4">
            {pagoSeleccionado.estado === 'pendiente' && (
              <button
                className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                onClick={() => marcarPagoComoPagado(pagoSeleccionado.id)}
              >
                Pagar
              </button>
            )}
            {pagoSeleccionado.estado === 'pagado' && (
            console.log(pagoSeleccionado),
            <button
              onClick={() => ComprobantePago(pagoSeleccionado)}
              className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              Descargar comprobante
            </button>
            )}
            <button
              onClick={() => setPagoSeleccionado(null)}
              className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
