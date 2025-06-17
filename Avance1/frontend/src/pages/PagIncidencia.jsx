import React, { useState, useEffect } from 'react';

const PagIncidencia = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [nuevaIncidencia, setNuevaIncidencia] = useState({
    ubicacion: '',
    importancia: 'Media',
    descripcion: '',
    estado: 'Nuevo',
    fotos: [],
  });

  // Simulación: cargar incidencias existentes
  useEffect(() => {
    // En el futuro esto vendrá de la API
    setIncidencias([
      {
        id: 1,
        ubicacion: 'Pasillo edificio B',
        importancia: 'Alta',
        descripcion: 'Fuga de agua en el techo',
        estado: 'En proceso',
        fotos: [],
      },
    ]);
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevaIncidencia(prev => ({ ...prev, [name]: value }));
  };

  const manejarFoto = (e) => {
    const files = Array.from(e.target.files);
    setNuevaIncidencia(prev => ({ ...prev, fotos: files }));
  };

  const agregarIncidencia = (e) => {
    e.preventDefault();
    const nueva = {
      ...nuevaIncidencia,
      id: Date.now(),
    };
    setIncidencias([...incidencias, nueva]);
    setNuevaIncidencia({
      ubicacion: '',
      importancia: 'Media',
      descripcion: '',
      estado: 'Nuevo',
      fotos: [],
    });

    // Aquí se debería llamar a la API y notificar a la comunidad (RF6.3)
    console.log('Notificar comunidad: Nueva incidencia creada');
  };

  const actualizarEstado = (id, nuevoEstado) => {
    setIncidencias(prev =>
      prev.map(inc =>
        inc.id === id ? { ...inc, estado: nuevoEstado } : inc
      )
    );

    // Aquí se debería notificar a la comunidad (RF6.3)
    console.log('Notificar comunidad: Cambio de estado');
  };

  return (
    <div className="p-6 text-black">
      <h2 className="text-3xl font-bold mb-4 text-indigo-600">Gestión de Incidencias</h2>

      {/* Formulario para registrar incidencia */}
      <form onSubmit={agregarIncidencia} className="mb-8 space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="font-semibold">Ubicación:</label>
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
          <label className="font-semibold">Importancia:</label>
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
          <label className="font-semibold">Descripción:</label>
          <textarea
            name="descripcion"
            value={nuevaIncidencia.descripcion}
            onChange={manejarCambio}
            required
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div>
          <label className="font-semibold">Fotos:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={manejarFoto}
            className="w-full"
          />
        </div>

        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
          Registrar Incidencia
        </button>
      </form>

      {/* Listado de incidencias */}
      <h3 className="text-2xl font-semibold mb-4">Incidencias registradas</h3>
      {incidencias.length === 0 ? (
        <p>No hay incidencias registradas.</p>
      ) : (
        <ul className="space-y-4">
          {incidencias.map((inc) => (
            <li key={inc.id} className="border p-4 rounded bg-gray-50">
              <p><strong>Ubicación:</strong> {inc.ubicacion}</p>
              <p><strong>Importancia:</strong> {inc.importancia}</p>
              <p><strong>Descripción:</strong> {inc.descripcion}</p>
              <p><strong>Estado:</strong> 
                <select
                  value={inc.estado}
                  onChange={(e) => actualizarEstado(inc.id, e.target.value)}
                  className="ml-2 p-1 border rounded"
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Resuelto">Resuelto</option>
                </select>
              </p>
              {inc.fotos.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {inc.fotos.map((foto, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(foto)}
                      alt="Incidencia"
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

export default PagIncidencia;
