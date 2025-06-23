import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import ReportePagos from '../components/ReportePagos';


const PagosTodosPage = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroRut, setFiltroRut] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const fetchPagos = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      const token = await user.getIdToken();

      const res = await fetch('http://localhost:4000/api/pagos/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al obtener pagos: ${errorText}`);
      }

      const data = await res.json();
      setPagos(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pagosFiltrados = pagos.filter((pago) => {
  const rutIncluye = pago.user?.rut?.toLowerCase().includes(filtroRut.toLowerCase());
  const estadoCoincide = filtroEstado === 'todos' || pago.estado === filtroEstado;
  return rutIncluye && estadoCoincide;
  });

  useEffect(() => {
    fetchPagos();
  }, []);

  if (loading) return <p className="text-black">Cargando pagos...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const [año, mes, dia] = fecha.split('T')[0].split('-');
    return `${dia}/${mes}/${año}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-indigo-500">Todos los Pagos Registrados</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Filtrar por RUT:</label>
          <input
            type="text"
            value={filtroRut}
            onChange={(e) => setFiltroRut(e.target.value)}
            className="px-3 py-2 border border-gray-300 text-black rounded w-full"
            placeholder="Ej: 12345678K"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-1">Filtrar por Estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 text-black rounded"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="pagado">Pagados</option>
          </select>
        </div>
        <div className="mt-6 sm:mt-0">
          <button
            onClick={() => ReportePagos(pagosFiltrados)}
            className="mt-6 sm:mt-5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow"
          >
            Descargar Reporte
          </button>
        </div>
      </div>

      {/* Tabla de pagos */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Descripción</th>
              <th className="px-4 py-2 border">RUT</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Apellido</th>
              <th className="px-4 py-2 border">Fecha Emisión</th>
              <th className="px-4 py-2 border">Fecha Vencimiento</th>
              <th className="px-4 py-2 border">Monto Total</th>
              <th className="px-4 py-2 border">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pagos
              .filter((pago) => {
                const rutIncluye = pago.user?.rut?.toLowerCase().includes(filtroRut.toLowerCase());
                const estadoCoincide = filtroEstado === 'todos' || pago.estado === filtroEstado;
                return rutIncluye && estadoCoincide;
              })
              .map((pago) => (
                <tr key={pago.id} className="text-center">
                  <td className="border px-4 py-2">{pago.descripcion || '—'}</td>
                  <td className="border px-4 py-2">{pago.user?.rut || '—'}</td>
                  <td className="border px-4 py-2">{pago.user?.firstName || '—'}</td>
                  <td className="border px-4 py-2">{pago.user?.lastName || '—'}</td>
                  <td className="border px-4 py-2">{formatearFecha(pago.fecha_emision) || '—'}</td>
                  <td className="border px-4 py-2">{formatearFecha(pago.fecha_vencimiento) || '—'}</td>
                  <td className="border px-4 py-2">${pago.monto_total.toFixed(2)}</td>
                  <td className="border px-4 py-2">{pago.estado || '—'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PagosTodosPage;
