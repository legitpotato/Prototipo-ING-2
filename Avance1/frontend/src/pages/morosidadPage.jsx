import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MorosidadPage() {
  const [morosos, setMorosos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroRut, setFiltroRut] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [sugerenciaIA, setSugerenciaIA] = useState('');
  const [resumenIA, setResumenIA] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [iaCargando, setIaCargando] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/morosidad/analisis', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMorosos(data);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const filtrarMorosos = morosos.filter((m) => {
    return (
      m.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
      m.rut.includes(filtroRut) &&
      m.fecha_vencimiento.includes(filtroFecha)
    );
  });

  if (loading) return <div className="text-black text-center mt-10">Cargando datos...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto text-black">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Análisis de Morosidad</h1>

      {/* Filtros */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Filtrar por nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-zinc-100"
        />
        <input
          type="text"
          placeholder="Filtrar por RUT"
          value={filtroRut}
          onChange={(e) => setFiltroRut(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-zinc-100"
        />
        <input
          type="text"
          placeholder="Filtrar por fecha (YYYY-MM-DD)"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-zinc-100"
        />
      </div>

      {/* Tabla de morosos */}
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-left border border-gray-300 bg-white">
          <thead className="bg-gray-200">
            <tr>
              {['Nombre', 'RUT', 'Monto Original', 'Interés', 'Total', 'Vencimiento', 'Días Atraso', 'Riesgo'].map((th) => (
                <th key={th} className="px-4 py-2 border text-sm font-semibold">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrarMorosos.map((m, i) => (
              <tr
                key={i}
                className={`${
                  m.riesgo === 'grave'
                    ? 'bg-red-100'
                    : m.riesgo === 'moderado'
                    ? 'bg-yellow-100'
                    : 'bg-green-100'
                }`}
              >
                <td className="border px-4 py-2">{m.nombre}</td>
                <td className="border px-4 py-2">{m.rut}</td>
                <td className="border px-4 py-2">${m.monto_original.toFixed(2)}</td>
                <td className="border px-4 py-2">${m.interes_acumulado.toFixed(2)}</td>
                <td className="border px-4 py-2">${m.monto_total.toFixed(2)}</td>
                <td className="border px-4 py-2">{m.fecha_vencimiento}</td>
                <td className="border px-4 py-2">{m.dias_atraso}</td>
                <td className="border px-4 py-2 font-semibold capitalize">{m.riesgo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Análisis con IA */}
      <div className="mt-10 bg-white shadow-md border border-gray-300 p-6 rounded-md">
        <h2 className="text-xl font-bold text-indigo-600 mb-4">Análisis con IA por RUT</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Ingresa RUT del residente"
            value={filtroRut}
            onChange={(e) => setFiltroRut(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2 border rounded-md bg-zinc-100"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                try {
                  setIaCargando(true);
                  const firebaseUser = getAuth().currentUser;
                  if (!firebaseUser) {
                    navigate('/login');
                    return;
                  }
                  const token = await firebaseUser.getIdToken();
                  const res = await fetch(`/api/morosidad/por-rut/${filtroRut}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  if (!res.ok) throw new Error('No se pudo obtener el análisis');

                  const data = await res.json();
                  setResumenIA(data.resumen);
                  setSugerenciaIA(data.sugerencia);
                } catch (err) {
                  console.error('Error al obtener análisis por RUT:', err);
                  setResumenIA('');
                  setSugerenciaIA('');
                } finally {
                  setIaCargando(false);
                }
              }}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
            >
              Analizar
            </button>

            {iaCargando && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="animate-spin h-5 w-5 text-indigo-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>Analizando con IA...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resultados IA */}
      {resumenIA && (
        <div className="mt-6 bg-indigo-100 p-4 rounded-md">
          <h3 className="font-bold text-indigo-700 mb-2">Resumen generado por IA:</h3>
          <pre className="whitespace-pre-wrap">{resumenIA}</pre>
        </div>
      )}
      {sugerenciaIA && (
        <div className="mt-4 bg-green-100 p-4 rounded-md">
          <h3 className="font-bold text-green-700 mb-2">Sugerencia de la IA:</h3>
          <p>{sugerenciaIA}</p>
        </div>
      )}
    </div>
  );
}