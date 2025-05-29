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
        console.warn('Usuario no autenticado');
        navigate('/login'); // Redirige al login si no hay sesión
        return;
      }

      try {
        const token = await user.getIdToken();

        const resMorosos = await fetch('/api/morosidad/analisis', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataMorosos = await resMorosos.json();
        setMorosos(dataMorosos);
      }
      finally {
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

  if (loading) {
    return <div className="text-black text-center mt-10">Cargando datos...</div>;
  }

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="bg-zinc-800 max-w-8xl w-full p-10 rounded-md overflow-x-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Análisis de Morosidad</h1>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Filtrar por nombre"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Filtrar por RUT"
            value={filtroRut}
            onChange={(e) => setFiltroRut(e.target.value)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Filtrar por fecha (YYYY-MM-DD)"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
        </div>

        {/* Tabla de morosos */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-700">
              <th className="border border-zinc-600 px-4 py-2 text-left">Nombre</th>
              <th className="border border-zinc-600 px-4 py-2 text-left">RUT</th>
              <th className="border border-zinc-600 px-4 py-2 text-left">Monto Original</th>
              <th className="border border-zinc-600 px-4 py-2 text-left">Interés Acumulado</th>
              <th className="border border-zinc-600 px-4 py-2 text-left">Monto Total</th>
              <th className="border border-zinc-600 px-4 py-2 text-left">Fecha Vencimiento</th>
              <th className="border border-zinc-600 px-4 py-2 text-left">Días de Atraso</th>
              <th className="border border-zinc-600 px-4 py-2 text-left">Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {filtrarMorosos.map((m, i) => (
              <tr
                key={i}
                className={
                  m.riesgo === 'grave'
                    ? 'bg-red-500'
                    : m.riesgo === 'moderado'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }
              >
                <td className="border border-zinc-600 px-4 py-2">{m.nombre}</td>
                <td className="border border-zinc-600 px-4 py-2">{m.rut}</td>
                <td className="border border-zinc-600 px-4 py-2">${m.monto_original.toFixed(2)}</td>
                <td className="border border-zinc-600 px-4 py-2">${m.interes_acumulado.toFixed(2)}</td>
                <td className="border border-zinc-600 px-4 py-2">${m.monto_total.toFixed(2)}</td>
                <td className="border border-zinc-600 px-4 py-2">{m.fecha_vencimiento}</td>
                <td className="border border-zinc-600 px-4 py-2">{m.dias_atraso}</td>
                <td className="border border-zinc-600 px-4 py-2">{m.riesgo}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Análisis por RUT con IA */}
        <div className="mt-10 bg-zinc-700 p-6 rounded-md text-white">
          <h2 className="text-xl font-bold mb-4">Análisis personalizado por RUT</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Ingresa RUT del residente"
              value={filtroRut}
              onChange={(e) => setFiltroRut(e.target.value)}
              className="w-full bg-zinc-600 px-4 py-2 rounded-md text-white"
            />
            <button
              onClick={async () => {
                try {
                  setIaCargando(true); // Mostrar spinner
                  if (!user) {
                    console.warn('Usuario no autenticado');
                    navigate('/login');
                    return;
                  }

                  const token = await user.getIdToken();

                  const res = await fetch(`/api/morosidad/por-rut/${filtroRut}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
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
                  setIaCargando(false); // Ocultar spinner
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white font-semibold"
            >
              Analizar
            </button>
            {iaCargando && (
              <div className="flex items-center gap-2 mt-4 text-white">
                <svg className="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>Generando análisis con IA...</span>
              </div>
            )}
          </div>
        </div>

        {/* Resumen y sugerencia IA */}
        {resumenIA && (
          <div className="bg-zinc-700 text-white p-4 rounded-md mt-6">
            <h2 className="text-xl font-bold mb-2">Resumen de Morosidad</h2>
            <pre className="whitespace-pre-wrap">{resumenIA}</pre>
          </div>
        )}

        {sugerenciaIA ? (
          <div className="bg-zinc-700 text-white p-4 rounded-md mt-4">
            <h2 className="text-xl font-bold mb-2">Sugerencia de la IA</h2>
            <p>{sugerenciaIA}</p>
          </div>
        ) : (
          <div className="bg-zinc-700 text-white p-4 rounded-md mt-4">
            <h2 className="text-xl font-bold mb-2">Sugerencia de la IA</h2>
            <p className="italic text-zinc-400">No se pudo generar una sugerencia en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
