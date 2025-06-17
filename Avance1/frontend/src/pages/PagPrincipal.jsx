import React from 'react';
import Carrusel from '../components/Carrusel';
import { useComunidad } from '../context/ComunidadContext';

function PagPrincipal() {
  const { comunidadActiva } = useComunidad();
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
        <h2 className="text-4xl text-indigo-500 font-bold mt-12 font-mono">
          Novedades
        </h2>
        <Carrusel />

        {/* Sección de Notificaciones */}
        <section className="mt-16 px-6">
          <h2 className="text-4xl text-indigo-500 font-bold mt-12 font-mono mb-8">Últimas Notificaciones</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white bg-opacity-90 rounded-lg shadow-md text-black font-medium">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Mensaje</th>
                  <th className="py-3 px-4">Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-300 hover:bg-gray-100">
                  <td className="py-2 px-4">1</td>
                  <td className="py-2 px-4">Se actualizó la Incidencia N°23</td>
                  <td className="py-2 px-4">27/05/2025</td>
                </tr>
                <tr className="border-t border-gray-300 hover:bg-gray-100">
                  <td className="py-2 px-4">2</td>
                  <td className="py-2 px-4">¡Tienes un pago pendiente!</td>
                  <td className="py-2 px-4">26/05/2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PagPrincipal;
