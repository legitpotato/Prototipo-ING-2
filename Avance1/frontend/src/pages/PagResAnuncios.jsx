import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useComunidad } from '../context/ComunidadContext';

const PagResAnuncios = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const auth = getAuth();
  const user = auth.currentUser;
  const { comunidadActiva } = useComunidad();
  const comunidadId = comunidadActiva?.id;

  const anunciosPorPagina = 3;

  useEffect(() => {
    if (!user || !comunidadId) return;

    const fetchAnuncios = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken();

        const res = await fetch(`http://localhost:4000/api/anuncios/${comunidadId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Error al cargar anuncios');

        const data = await res.json();
        setAnuncios(data);
        setErrorMsg('');
      } catch (err) {
        console.error(err);
        setErrorMsg('No se pudieron cargar los anuncios');
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncios();
  }, [user, comunidadId]);

  // Filtrado por tipo de anuncio
  const anunciosFiltrados = anuncios.filter((a) => {
    return !tipoFiltro || a.tipoAnuncio === tipoFiltro;
  });

  const totalPaginas = Math.ceil(anunciosFiltrados.length / anunciosPorPagina);
  const indexInicio = (paginaActual - 1) * anunciosPorPagina;
  const anunciosAMostrar = anunciosFiltrados.slice(indexInicio, indexInicio + anunciosPorPagina);

  return (
    <div className="p-6 text-black max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">Anuncios de la Comunidad</h2>

      {/* Filtro */}
      <div className="mb-6 w-48">
        <label className="block text-sm font-medium mb-1">Filtrar por tipo de anuncio:</label>
        <select
          value={tipoFiltro}
          onChange={(e) => {
            setTipoFiltro(e.target.value);
            setPaginaActual(1); // resetear paginación al cambiar filtro
          }}
          className="p-2 border rounded w-full"
        >
          <option value="">Todos</option>
          <option value="general">Anuncio General</option>
          <option value="reunion">Reunión Virtual</option>
          <option value="recordatorio">Recordatorio</option>
        </select>
      </div>

      {/* Listado */}
      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : errorMsg ? (
        <p className="text-red-600">{errorMsg}</p>
      ) : anunciosFiltrados.length === 0 ? (
        <p className="text-gray-600">No hay anuncios disponibles con el filtro seleccionado.</p>
      ) : (
        <ul className="space-y-6">
          {anunciosAMostrar.map((a) => (
            <li key={a.id} className="border p-4 rounded bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{a.titulo}</h3>
              <p className="mb-2">{a.contenido}</p>

              {a.tipoAnuncio === 'reunion' && a.enlaceReunion && (
                <p className="mb-2">
                  <strong>Enlace reunión:</strong>{' '}
                  <a
                    href={a.enlaceReunion}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline"
                  >
                    {a.enlaceReunion}
                  </a>
                </p>
              )}

              <p>
                <strong>Comentarios:</strong>{' '}
                <span className="font-semibold">{a.permitirComentarios ? 'Habilitados' : 'Deshabilitados'}</span>
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Creado el {new Date(a.createdAt).toLocaleString()}
              </p>
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

export default PagResAnuncios;
