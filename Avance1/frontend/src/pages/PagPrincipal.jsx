import React, { useEffect, useState } from 'react';
import Carrusel from '../components/Carrusel';
import { useComunidad } from '../context/ComunidadContext';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

function PagPrincipal() {
  const { comunidadActiva } = useComunidad();
  const [ultimosAnuncios, setUltimosAnuncios] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const comunidadId = comunidadActiva?.id;

  useEffect(() => {
    if (!user || !comunidadId) return;

    const fetchAnuncios = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`http://localhost:4000/api/anuncios/${comunidadId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Error al obtener anuncios');

        const data = await res.json();
        // Ordenar por fecha descendente y tomar los dos primeros
        const ultimos = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 2);
        setUltimosAnuncios(ultimos);
      } catch (error) {
        console.error('Error al obtener los anuncios:', error);
      }
    };

    fetchAnuncios();
  }, [user, comunidadId]);

  return (
    <div className="min-h-screen">
      {/* Banner superior con margen lateral */}
      <div className="relative h-64">
        {/* Imagen de fondo */}
        <img
          src="src/assets/Condominio.jpg"
          alt="Foto banner"
          className="w-full h-full object-cover rounded-lg opacity-80 mt-5"
        />

        {/* Texto centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-black text-4xl font-bold bg-white bg-opacity-70 px-6 py-3 rounded-lg">
            {comunidadActiva?.nombre || 'Mi Comunidad'}
          </h1>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6">
        <h2 className="text-4xl text-indigo-500 font-bold mt-12 font-mono">Novedades</h2>
        <Carrusel />

        {/* Sección de Notificaciones */}
        <section className="mt-16 px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl text-indigo-500 font-bold font-mono">Últimos Anuncios</h2>
            <Link
              to="/anuncios"
              className="text-indigo-600 hover:text-indigo-800 underline text-lg"
            >
              Ver todos
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white bg-opacity-90 rounded-lg shadow-md text-black font-medium">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Título</th>
                  <th className="py-3 px-4">Descripción</th>
                  <th className="py-3 px-4">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ultimosAnuncios.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-3 px-4 text-gray-500 italic text-center">
                      No hay anuncios recientes.
                    </td>
                  </tr>
                ) : (
                  ultimosAnuncios.map((anuncio, index) => (
                    <tr key={anuncio.id} className="border-t border-gray-300 hover:bg-gray-100">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4 font-semibold text-indigo-700">{anuncio.titulo}</td>
                      <td className="py-2 px-4">
                        {anuncio.contenido.length > 60
                          ? anuncio.contenido.slice(0, 60) + '...'
                          : anuncio.contenido}
                      </td>
                      <td className="py-2 px-4">{new Date(anuncio.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PagPrincipal;
