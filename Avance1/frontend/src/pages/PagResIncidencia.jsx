import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useComunidad } from '../context/ComunidadContext';

const PagResIncidencia = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [importanciaFiltro, setImportanciaFiltro] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const auth = getAuth();
  const user = auth.currentUser;
  const { comunidadActiva } = useComunidad();
  const comunidadId = comunidadActiva?.id;

  const incidenciasPorPagina = 3;

  useEffect(() => {
    if (!user || !comunidadId) return;

    const fetchIncidencias = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken();

        const res = await fetch(`http://localhost:4000/api/incidencias/comunidad/${comunidadId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Error al cargar incidencias");

        const data = await res.json();
        setIncidencias(data);
        setErrorMsg('');
      } catch (err) {
        console.error(err);
        setErrorMsg('No se pudieron cargar las incidencias');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidencias();
  }, [user, comunidadId]);

  // Filtro combinado
  const incidenciasFiltradas = incidencias.filter((inc) => {
    const coincideEstado = !estadoFiltro || inc.estado === estadoFiltro;
    const coincideImportancia = !importanciaFiltro || inc.importancia === importanciaFiltro;
    return coincideEstado && coincideImportancia;
  });

  const totalPaginas = Math.ceil(incidenciasFiltradas.length / incidenciasPorPagina);
  const indexInicio = (paginaActual - 1) * incidenciasPorPagina;
  const incidenciasAMostrar = incidenciasFiltradas.slice(indexInicio, indexInicio + incidenciasPorPagina);

  return (
    <div className="p-6 text-black max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">Incidencias en la Comunidad</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Filtrar por estado:</label>
          <select
            value={estadoFiltro}
            onChange={(e) => {
              setEstadoFiltro(e.target.value);
              setPaginaActual(1); // reset
            }}
            className="p-2 border rounded"
          >
            <option value="">Todos</option>
            <option value="Nuevo">Nuevo</option>
            <option value="EnProceso">En proceso</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Filtrar por importancia:</label>
          <select
            value={importanciaFiltro}
            onChange={(e) => {
              setImportanciaFiltro(e.target.value);
              setPaginaActual(1); // reset
            }}
            className="p-2 border rounded"
          >
            <option value="">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
      </div>

      {/* Listado */}
      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : errorMsg ? (
        <p className="text-red-600">{errorMsg}</p>
      ) : incidenciasFiltradas.length === 0 ? (
        <p className="text-gray-600">No hay incidencias registradas con los filtros seleccionados.</p>
      ) : (
        <ul className="space-y-6">
          {incidenciasAMostrar.map((inc) => (
            <li key={inc.id} className="border p-4 rounded bg-white shadow-sm">
              <p><strong>Ubicación:</strong> {inc.ubicacion}</p>
              <p><strong>Importancia:</strong> {inc.importancia}</p>
              <p><strong>Descripción:</strong> {inc.descripcion}</p>
              <p><strong>Estado:</strong> <span className="italic text-indigo-500">{inc.estado}</span></p>

              {inc.creador && (
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Creado por:</strong> {inc.creador.firstName} {inc.creador.lastName} ({inc.creador.email})
                </p>
              )}

              {inc.fotos.length > 0 && (
                <div className="mt-3 flex gap-3 flex-wrap">
                  {inc.fotos.map((fotoUrl, i) => (
                    <img
                      key={i}
                      src={fotoUrl}
                      alt={`Foto incidencia ${i + 1}`}
                      className="w-24 h-24 object-cover border rounded"
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              onClick={() => setPaginaActual(i + 1)}
              className={`px-3 py-1 rounded ${
                paginaActual === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PagResIncidencia;
