import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useComunidad } from '../context/ComunidadContext.jsx';

const PagAnunciosDirectiva = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [nuevoAnuncio, setNuevoAnuncio] = useState({
    titulo: '',
    contenido: '',
    tipoAnuncio: 'general', // 'general', 'reunion', 'recordatorio'
    enlaceReunion: '',
    permitirComentarios: true,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Para filtro y paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const anunciosPorPagina = 3;

  const auth = getAuth();
  const user = auth.currentUser;
  const { comunidadActiva } = useComunidad();
  const comunidadId = comunidadActiva?.id;

  useEffect(() => {
    if (!user || !comunidadId) {
      setAnuncios([]);
      return;
    }

    const fetchAnuncios = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken();

        const res = await fetch(`http://localhost:4000/api/anuncios/${comunidadId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Error en la respuesta del backend:', errorData);
          throw new Error('Error al cargar anuncios');
        }

        const data = await res.json();

        // Si backend solo devuelve array, usar data directamente.
        // Si backend devuelve { anuncios: [...], totalPages, ...}, ajustar.
        setAnuncios(data);
        setErrorMsg('');
      } catch (err) {
        console.error('Error al obtener anuncios:', err);
        setErrorMsg('No se pudieron cargar los anuncios');
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncios();
  }, [user, comunidadId]);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoAnuncio((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const manejarFiltroTipo = (e) => {
    setFiltroTipo(e.target.value);
    setPaginaActual(1);
  };

  const agregarAnuncio = async (e) => {
    e.preventDefault();

    if (!user || !comunidadId || !nuevoAnuncio.titulo || !nuevoAnuncio.contenido) {
      alert('Debes completar título y contenido');
      return;
    }

    const anuncioData = {
      titulo: nuevoAnuncio.titulo,
      contenido: nuevoAnuncio.contenido,
      tipoAnuncio: nuevoAnuncio.tipoAnuncio,
      enlaceReunion: nuevoAnuncio.tipoAnuncio === 'reunion' ? nuevoAnuncio.enlaceReunion : null,
      permitirComentarios: nuevoAnuncio.permitirComentarios,
      comunidadId: comunidadId,
    };

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:4000/api/anuncios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(anuncioData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al crear anuncio');
      }

      const nuevo = await res.json();
      setAnuncios((prev) => [nuevo, ...prev]);
      setNuevoAnuncio({
        titulo: '',
        contenido: '',
        tipoAnuncio: 'general',
        enlaceReunion: '',
        permitirComentarios: true,
      });
      setErrorMsg('');
    } catch (error) {
      console.error('Error al crear anuncio:', error.message);
      setErrorMsg('Error al crear anuncio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // === FILTRO ===
  let anunciosFiltrados = filtroTipo === 'Todos' ? anuncios : anuncios.filter(a => a.tipoAnuncio === filtroTipo);

  // === PAGINACIÓN ===
  const totalPaginas = Math.ceil(anunciosFiltrados.length / anunciosPorPagina);
  const indexInicio = (paginaActual - 1) * anunciosPorPagina;
  const indexFin = indexInicio + anunciosPorPagina;
  const anunciosAMostrar = anunciosFiltrados.slice(indexInicio, indexFin);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-black">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Gestión de Anuncios</h1>

      {errorMsg && <p className="mb-4 text-red-600">{errorMsg}</p>}

      {/* Formulario para crear anuncio */}
      <form onSubmit={agregarAnuncio} className="bg-white p-6 rounded shadow-md mb-8 space-y-4">
        <div>
          <label className="block font-semibold mb-1">Tipo de anuncio:</label>
          <select
            name="tipoAnuncio"
            value={nuevoAnuncio.tipoAnuncio}
            onChange={manejarCambio}
            className="w-full border rounded px-3 py-2"
          >
            <option value="general">Anuncio General</option>
            <option value="reunion">Reunión Virtual</option>
            <option value="recordatorio">Recordatorio</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Título:</label>
          <input
            type="text"
            name="titulo"
            value={nuevoAnuncio.titulo}
            onChange={manejarCambio}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Contenido:</label>
          <textarea
            name="contenido"
            value={nuevoAnuncio.contenido}
            onChange={manejarCambio}
            rows={4}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {nuevoAnuncio.tipoAnuncio === 'reunion' && (
          <div>
            <label className="block font-semibold mb-1">Enlace de la reunión (Zoom, Meet, etc.):</label>
            <input
              type="url"
              name="enlaceReunion"
              value={nuevoAnuncio.enlaceReunion}
              onChange={manejarCambio}
              placeholder="https://zoom.us/..."
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            name="permitirComentarios"
            checked={nuevoAnuncio.permitirComentarios}
            onChange={manejarCambio}
            className="mr-2"
            id="permitirComentarios"
          />
          <label htmlFor="permitirComentarios" className="font-semibold">
            Permitir comentarios en este anuncio
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          {loading ? 'Creando...' : 'Crear Anuncio'}
        </button>
      </form>

      {/* Filtro tipo de anuncio */}
      <div className="mb-6 flex items-center gap-4">
        <label className="font-semibold mr-2">Filtrar por tipo de anuncio:</label>
        <select
          value={filtroTipo}
          onChange={manejarFiltroTipo}
          className="p-2 border rounded"
        >
          <option value="Todos">Todos</option>
          <option value="general">Anuncio General</option>
          <option value="reunion">Reunión Virtual</option>
          <option value="recordatorio">Recordatorio</option>
        </select>
      </div>

      {/* Lista de anuncios */}
      {anunciosFiltrados.length === 0 ? (
        <p>No hay anuncios registrados.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {anunciosAMostrar.map((a) => (
              <li key={a.id} className="border rounded p-4 bg-white shadow">
                <h3 className="text-xl font-bold mb-2">{a.titulo}</h3>
                <p className="mb-1">{a.contenido}</p>
                {a.tipoAnuncio === 'reunion' && a.enlaceReunion && (
                  <p className="mb-1">
                    Enlace reunión:{' '}
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
                  Comentarios:{' '}
                  <span className="font-semibold">{a.permitirComentarios ? 'Habilitados' : 'Deshabilitados'}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Creado el {new Date(a.createdAt).toLocaleString()}
                </p>
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

export default PagAnunciosDirectiva;
