import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

const PagosTodosPage = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchPagos();
  }, []);

  if (loading) return <p className="text-black">Cargando pagos...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Todos los Pagos Registrados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">RUT</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Apellido</th>
              <th className="px-4 py-2 border">Fecha Emisión</th>
              <th className="px-4 py-2 border">Fecha Vencimiento</th>
              <th className="px-4 py-2 border">Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id} className="text-center">
                <td className="border px-4 py-2">{pago.user?.rut || '—'}</td>
                <td className="border px-4 py-2">{pago.user?.firstName || '—'}</td>
                <td className="border px-4 py-2">{pago.user?.lastName || '—'}</td>
                <td className="border px-4 py-2">{new Date(pago.fecha_emision).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(pago.fecha_vencimiento).toLocaleDateString()}</td>
                <td className="border px-4 py-2">${pago.monto_total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PagosTodosPage;
