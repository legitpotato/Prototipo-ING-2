import React, { useEffect, useState } from 'react';
import { useComunidad } from '../context/ComunidadContext';
import { getAuth } from 'firebase/auth';

function GestionUsuariosPage() {
  const { comunidadActiva } = useComunidad();
  const [usuarios, setUsuarios] = useState([]);
  const [rolesEditados, setRolesEditados] = useState({});

useEffect(() => {
  const fetchUsuarios = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !comunidadActiva || !comunidadActiva.id) {
      console.warn('⛔ comunidadActiva no está lista aún');
      return;
    }

    const token = await user.getIdToken();

    try {
      const res = await fetch(`/api/comunidades/${comunidadActiva.id}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error('Respuesta inesperada:', data);
        return;
      }

      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  fetchUsuarios();
}, [comunidadActiva]);

const handleRolChange = (userId, nuevoRol) => {
  setRolesEditados((prev) => ({
    ...prev,
    [userId]: nuevoRol,
  }));
};


  const guardarCambios = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const token = await user.getIdToken();

    for (const userId in rolesEditados) {
      const nuevoRol = rolesEditados[userId];

      await fetch(`/api/comunidades/${comunidadActiva.id}/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nuevoRol }),
      });
    }

    alert('Cambios guardados');
    setRolesEditados({});
    window.location.reload(); // o volver a cargar usuarios
  };

console.log('Comunidad activa2:', comunidadActiva);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-500">Gestión de Usuarios</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-black">
          <tr>
            <th className="py-2 px-4">Nombre</th>
            <th className="py-2 px-4">RUT</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Rol</th>
          </tr>
        </thead>
          <tbody>
            {Array.isArray(usuarios) && usuarios.map(({ user, rol }) => (
              <tr key={user.id} className="border-t text-black">
                <td className="py-2 px-4">{user.firstName} {user.lastName}</td>
                <td className="py-2 px-4">{user.rut}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">
                  <select
                    value={rolesEditados[user.id] || rol}
                    onChange={(e) => handleRolChange(user.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="VECINO">Vecino</option>
                    <option value="DIRECTIVA">Directiva</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
      </table>

      <button
        onClick={guardarCambios}
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Guardar Cambios
      </button>
    </div>
  );
}

export default GestionUsuariosPage;
