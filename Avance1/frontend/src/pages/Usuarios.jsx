import { useState, useEffect } from "react";
import axios from "axios";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]); // Datos de los usuarios
  const [search, setSearch] = useState(""); // Búsqueda de usuarios
  const [error, setError] = useState(""); // Manejo de errores
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const usersPerPage = 10; // Número de usuarios por página

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get("http://localhost:5000/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        setError("Error al cargar los usuarios.");
        console.error(error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const toggleAdmin = async (id, currentAdmin) => {
    try {
      const response = await axios.patch(`http://localhost:5000/usuarios/${id}`, {
        admin: !currentAdmin,
      });
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario._id === id ? { ...usuario, admin: response.data.admin } : usuario
        )
      );
    } catch (error) {
      setError("Error al cambiar el rol de administrador.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("¿Estás seguro de que deseas eliminar esta cuenta?")) {
        await axios.delete(`http://localhost:5000/usuarios/${id}`);
        setUsuarios((prevUsuarios) => prevUsuarios.filter((u) => u._id !== id));
      }
    } catch (error) {
      setError("Error al eliminar la cuenta.");
      console.error(error);
    }
  };

  // Filtrar usuarios según búsqueda
  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Dividir los usuarios en páginas
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);

  // Cambiar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="p-6 bg-zinc-800 rounded-lg mt-12 mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Usuarios</h2>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={search}
          onChange={handleSearchChange}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
        />
      </div>
      <table className="w-full text-left text-white">
        <thead>
          <tr>
            <th className="border-b border-gray-700 p-2">Nombre</th>
            <th className="border-b border-gray-700 p-2">Correo</th>
            <th className="border-b border-gray-700 p-2">Admin</th>
            <th className="border-b border-gray-700 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((usuario) => (
            <tr key={usuario._id}>
              <td className="border-b border-gray-700 p-2">{usuario.nombre}</td>
              <td className="border-b border-gray-700 p-2">{usuario.correo}</td>
              <td className="border-b border-gray-700 p-2">{usuario.admin ? "Sí" : "No"}</td>
              <td className="border-b border-gray-700 p-2">
                <button
                  onClick={() => toggleAdmin(usuario._id, usuario.admin)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
                >
                  {usuario.admin ? "Quitar Admin" : "Hacer Admin"}
                </button>
                <button
                  onClick={() => handleDelete(usuario._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Paginación deah */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 rounded-lg ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Usuarios;
