import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useComunidad } from '../context/ComunidadContext.jsx';

const PagIncidencia = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [nuevaIncidencia, setNuevaIncidencia] = useState({
    ubicacion: '',
    importancia: 'Media',
    descripcion: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [ordenImportancia, setOrdenImportancia] = useState('');

  const incidenciasPorPagina = 3;

  const auth = getAuth();
  const user = auth.currentUser;
  const { comunidadActiva } = useComunidad();
  const comunidadId = comunidadActiva?.id;

  useEffect(() => {
    if (!user || !comunidadId) {
      setIncidencias([]);
      return;
    }

    const fetchIncidencias = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken();
        const res = await fetch(`http://localhost:4000/api/incidencias/comunidad/${comunidadId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar incidencias');
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

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevaIncidencia(prev => ({ ...prev, [name]: value }));
  };

  const manejarFiltroEstado = (e) => {
    setFiltroEstado(e.target.value);
    setPaginaActual(1);
  };

  const manejarOrdenImportancia = (e) => {
    setOrdenImportancia(e.target.value);
    setPaginaActual(1);
  };

  const agregarIncidencia = async (e) => {
    e.preventDefault();

    if (!user || !comunidadId || !nuevaIncidencia.ubicacion || !nuevaIncidencia.descripcion) {
      alert("Debes completar todos los campos obligatorios");
      return;
    }

    const incidenciaData = {
      ubicacion: nuevaIncidencia.ubicacion,
      importancia: nuevaIncidencia.importancia,
      descripcion: nuevaIncidencia.descripcion,
      fotos: [],
      comunidadId: comunidadId,
    };

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:4000/api/incidencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(incidenciaData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const nuevaInc = await res.json();
      setIncidencias(prev => [nuevaInc, ...prev]);
      setNuevaIncidencia({ ubicacion: '', importancia: 'Media', descripcion: '' });
      setErrorMsg('');
    } catch (error) {
      console.error('Error al crear incidencia:', error.message);
      setErrorMsg('Error al crear incidencia: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    if (!user) {
      alert('Debes iniciar sesión');
      return;
    }

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:4000/api/incidencias/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error('Error al actualizar estado');

      const incidenciaActualizada = await res.json();
      setIncidencias(prev => prev.map(inc => inc.id === id ? incidenciaActualizada : inc));
      setErrorMsg('');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar estado');
    } finally {
      setLoading(false);
    }
  };

  // === FILTRO + ORDENAMIENTO ===
  let incidenciasFiltradas = filtroEstado === 'Todos'
    ? incidencias
    : incidencias.filter(inc => inc.estado === filtroEstado);

  if (ordenImportancia) {
  const importanciaOrden = { Alta: 3, Media: 2, Baja: 1 };
  incidenciasFiltradas.sort((a, b) => {
    const valorA = importanciaOrden[a.importancia];
    const valorB = importanciaOrden[b.importancia];
    return ordenImportancia === 'desc' ? valorB - valorA : valorA - valorB;
  });
}

  const totalPaginas = Math.ceil(incidenciasFiltradas.length / incidenciasPorPagina);
  const indexInicio = (paginaActual - 1) * incidenciasPorPagina;
  const indexFin = indexInicio + incidenciasPorPagina;
  const incidenciasAMostrar = incidenciasFiltradas.slice(indexInicio, indexFin);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6 text-black max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">Gestión de Incidencias</h2>

      {errorMsg && <p className="mb-4 text-red-600">{errorMsg}</p>}

      {/* Formulario */}
      <form onSubmit={agregarIncidencia} className="mb-8 space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="font-semibold block mb-1">Ubicación <span className="text-red-500">*</span>:</label>
          <input
            type="text"
            name="ubicacion"
            value={nuevaIncidencia.ubicacion}
            onChange={manejarCambio}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Importancia:</label>
          <select
            name="importancia"
            value={nuevaIncidencia.importancia}
            onChange={manejarCambio}
            className="w-full p-2 border rounded"
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Descripción <span className="text-red-500">*</span>:</label>
          <textarea
            name="descripcion"
            value={nuevaIncidencia.descripcion}
            onChange={manejarCambio}
            required
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded"
          disabled={loading}
        >
          Registrar Incidencia
        </button>
      </form>

      {/* Filtros */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center">
        <div>
          <label className="mr-2 font-semibold">Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={manejarFiltroEstado}
            className="p-2 border rounded"
          >
            <option value="Todos">Todos</option>
            <option value="Nuevo">Nuevo</option>
            <option value="EnProceso">En proceso</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Ordenar por importancia:</label>
          <select
            value={ordenImportancia}
            onChange={(e) => setOrdenImportancia(e.target.value)}
            className="p-2 border rounded"
          >
  <option value="">Sin orden</option>
  <option value="desc">Mayor importancia primero</option>
  <option value="asc">Menor importancia primero</option>
</select>

        </div>
      </div>

      {/* Listado de incidencias */}
      {incidenciasFiltradas.length === 0 ? (
        <p>No hay incidencias registradas.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {incidenciasAMostrar.map((inc) => (
              <li key={inc.id} className="border p-4 rounded bg-gray-50">
                <p><strong>Ubicación:</strong> {inc.ubicacion}</p>
                <p><strong>Importancia:</strong> {inc.importancia}</p>
                <p><strong>Descripción:</strong> {inc.descripcion}</p>
                <p>
                  <strong>Estado:</strong>
                  <select
                    value={inc.estado}
                    onChange={(e) => actualizarEstado(inc.id, e.target.value)}
                    className="ml-2 p-1 border rounded"
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="EnProceso">En proceso</option>
                    <option value="Resuelto">Resuelto</option>
                  </select>
                </p>
                {inc.creador && (
                  <p className="text-sm text-gray-600">
                    Creado por: {inc.creador.firstName} {inc.creador.lastName} ({inc.creador.email})
                  </p>
                )}
              </li>
            ))}
          </ul>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(totalPaginas)].map((_, i) => (
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
        </>
      )}
    </div>
  );
};

export default PagIncidencia;
