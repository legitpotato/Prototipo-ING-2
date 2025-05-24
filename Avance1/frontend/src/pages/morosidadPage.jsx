
import React, { useEffect, useState } from 'react';

export default function MorosidadPage() {
  const [morosos, setMorosos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroRut, setFiltroRut] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [sugerenciaIA, setSugerenciaIA] = useState('');
  const [resumenIA, setResumenIA] = useState('');

  useEffect(() => {
    fetch('/api/morosidad/analisis')
      .then(res => res.json())
      .then(data => setMorosos(data))
      .catch(err => console.error('Error al obtener morosidad:', err));

    fetch('/api/morosidad/ia')
      .then(res => res.json())
      .then(data => {
        setResumenIA(data.resumen);
        setSugerenciaIA(data.sugerencia);
      })
      .catch(err => console.error('Error al obtener sugerencia IA:', err));
  }, []);

  const filtrarMorosos = morosos.filter(m => {
    return (
      m.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
      m.rut.includes(filtroRut) &&
      m.fecha_vencimiento.includes(filtroFecha)
    );
  });

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-4xl w-full p-10 rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">Análisis de Morosidad</h1>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Filtrar por nombre"
            value={filtroNombre}
            onChange={e => setFiltroNombre(e.target.value)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Filtrar por RUT"
            value={filtroRut}
            onChange={e => setFiltroRut(e.target.value)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Filtrar por fecha (YYYY-MM-DD)"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
        </div>

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
              <tr key={i} className={m.riesgo === 'grave' ? 'bg-red-500' : m.riesgo === 'moderado' ? 'bg-yellow-500' : 'bg-green-500'}>
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

        {resumenIA && (
          <div className="bg-zinc-700 text-white p-4 rounded-md mt-6">
            <h2 className="text-xl font-bold mb-2">Resumen de Morosidad</h2>
            <pre className="whitespace-pre-wrap">{resumenIA}</pre>
          </div>
        )}

        {sugerenciaIA && (
          <div className="bg-zinc-700 text-white p-4 rounded-md mt-4">
            <h2 className="text-xl font-bold mb-2">Sugerencia de la IA</h2>
            <p>{sugerenciaIA}</p>
          </div>
        )}
      </div>
    </div>
  );
}
