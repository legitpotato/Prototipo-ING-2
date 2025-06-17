import React, { useEffect, useState } from 'react';

const PagResIncidencia = () => {
  const [incidencias, setIncidencias] = useState([]);

  useEffect(() => {
    // En un caso real, esto vendría de la API: GET /api/incidencias
    setIncidencias([
      {
        id: 1,
        ubicacion: 'Pasillo edificio B',
        importancia: 'Alta',
        descripcion: 'Fuga de agua en el techo',
        estado: 'En proceso',
        fotos: [],
      },
      {
        id: 2,
        ubicacion: 'Patio central',
        importancia: 'Media',
        descripcion: 'Luminaria quemada',
        estado: 'Resuelto',
        fotos: [],
      },
    ]);
  }, []);

  return (
    <div className="p-6 text-black">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">Incidencias en la Comunidad</h2>

      {incidencias.length === 0 ? (
        <p className="text-gray-600">No hay incidencias registradas.</p>
      ) : (
        <ul className="space-y-6">
          {incidencias.map((inc) => (
            <li key={inc.id} className="border p-4 rounded bg-white shadow-sm">
              <p><strong>Ubicación:</strong> {inc.ubicacion}</p>
              <p><strong>Importancia:</strong> {inc.importancia}</p>
              <p><strong>Descripción:</strong> {inc.descripcion}</p>
              <p><strong>Estado:</strong> <span className="italic text-indigo-500">{inc.estado}</span></p>

              {inc.fotos.length > 0 && (
                <div className="mt-3 flex gap-3 flex-wrap">
                  {inc.fotos.map((foto, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(foto)}
                      alt={`Foto ${i + 1}`}
                      className="w-24 h-24 object-cover border rounded"
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PagResIncidencia;
