import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Documentos = () => {
  const [documentos, setDocumentos] = useState([]); // Datos de los documentos
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage] = useState(10); // Cantidad de elementos por página
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(""); // Manejo de errores
  const [successMessage, setSuccessMessage] = useState(""); // Mensaje de éxito
  const [search, setSearch] = useState(""); // Texto de búsqueda
  const { user } = useAuth();

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setDocumentos(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error al obtener los documentos.");
        }
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
        console.error("Error de conexión:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentos();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Resetear a la primera página al realizar una búsqueda
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Estas a punto de eliminar un documento, ¿deseas continuar?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        // Si la eliminación es exitosa, actualizar el estado
        setDocumentos(documentos.filter((documento) => documento._id !== id));
        setSuccessMessage("Documento eliminado exitosamente");

        // Limpiar el mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al eliminar el documento.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
      console.error("Error de conexión:", err);
    }
  };

  if (loading) {
    return <p className="text-white text-center">Cargando documentos...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!documentos.length) {
    return <p className="text-white text-center">No hay documentos registrados.</p>;
  }

  // Filtrar los datos según el texto de búsqueda
  const filteredDocumentos = documentos.filter((documento) =>
    documento.cod.toLowerCase().includes(search.toLowerCase())
  );

  // Calcular datos para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocumentos.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredDocumentos.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 bg-zinc-800 rounded-lg mt-12 mb-12">
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Documentos Disponibles</h2>
        <input
          type="text"
          placeholder="Buscar por código"
          value={search}
          onChange={handleSearchChange}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
        />
      </div>
      <table className="w-full text-left text-white">
        <thead>
          <tr>
            <th className="border-b border-gray-700 p-2">Código</th>
            <th className="border-b border-gray-700 p-2">Título</th>
            <th className="border-b border-gray-700 p-2">Autor</th>
            <th className="border-b border-gray-700 p-2">Tipo de Documento</th>
            <th className="border-b border-gray-700 p-2">Categoría</th>
            <th className="border-b border-gray-700 p-2">Ubicación</th>
            <th className="border-b border-gray-700 p-2">Cantidad</th>
            <th className="border-b border-gray-700 p-2">Eliminar</th> {/* Columna para el botón de eliminar */}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((documento) => (
            <tr key={documento._id}>
              <td className="border-b border-gray-700 p-2">{documento.cod}</td>
              <td className="border-b border-gray-700 p-2">{documento.title}</td>
              <td className="border-b border-gray-700 p-2">{documento.autor}</td>
              <td className="border-b border-gray-700 p-2">{documento.tipodoc}</td>
              <td className="border-b border-gray-700 p-2">{documento.categoria}</td>
              <td className="border-b border-gray-700 p-2">{documento.ubicacion}</td>
              <td className="border-b border-gray-700 p-2">{documento.cantidad}</td>
              <td className="border-b border-gray-700 p-2">
                <button
                  onClick={() => handleDelete(documento._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-600 text-white rounded mr-2 disabled:opacity-50"
        >
          Anterior
        </button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => handlePageChange(page + 1)}
            className={`px-4 py-2 ${
              page + 1 === currentPage ? "bg-blue-500" : "bg-gray-600"
            } text-white rounded mx-1`}
          >
            {page + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-600 text-white rounded ml-2 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Documentos;
