import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterMulta, setFilterMulta] = useState(false); // Estado para filtrar por multa
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/prestamos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setHistorial(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error al obtener el historial.");
        }
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
        console.error("Error de conexión:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const calcularMulta = (fechaLimite) => {
    const fechaActual = new Date();
    const fechaDevolucion = new Date(fechaLimite);
    const diferenciaEnMilisegundos = fechaActual - fechaDevolucion;
    const diferenciaEnDias = Math.floor(diferenciaEnMilisegundos / (1000 * 3600 * 24));
    return diferenciaEnDias > 0 ? diferenciaEnDias : 0;
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDevolver = async (prestamoId, multa) => {
    const confirmMessage = multa
      ? `El usuario será sancionado con ${multa} días de multa por devolver tarde. ¿Deseas continuar?`
      : "¿Deseas devolver este préstamo?";
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`http://localhost:4000/api/prestamos/${prestamoId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          setHistorial((prevHistorial) => prevHistorial.filter((prestamo) => prestamo._id !== prestamoId));
          setSuccessMessage("El documento ha sido devuelto exitosamente.");
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error al devolver el documento.");
        }
      } catch (err) {
        console.error("Error al devolver el préstamo:", err);
        setError("Hubo un problema al procesar la devolución.");
      }
    }
  };

  const toggleFilterMulta = () => {
    setFilterMulta(!filterMulta);
    setCurrentPage(1);
  };

  if (loading) return <p className="text-white text-center">Cargando historial...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!historial.length) return <p className="text-white text-center">No hay préstamos registrados.</p>;

  const filteredHistorial = historial.filter((prestamo) => {
    if (filterMulta) return calcularMulta(prestamo.fecha_limite) > 0;
    return prestamo.codigo_pre.toLowerCase().includes(search.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistorial.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredHistorial.length / itemsPerPage);

  return (
    <div className="p-6 bg-zinc-800 rounded-lg mt-12 mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Historial de Préstamos</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por código"
            value={search}
            onChange={handleSearchChange}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          />
          <button
            onClick={toggleFilterMulta}
            className={`px-4 py-2 ${
              filterMulta ? "bg-blue-500" : "bg-gray-600"
            } text-white rounded`}
          >
            {filterMulta ? "Ver Todos" : "Filtrar Multa"}
          </button>
        </div>
      </div>
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      <table className="w-full text-left text-white">
        <thead>
          <tr>
            <th className="border-b border-gray-700 p-2">Código</th>
            <th className="border-b border-gray-700 p-2">Nombre del Documento</th>
            <th className="border-b border-gray-700 p-2">Nombre del Usuario</th>
            <th className="border-b border-gray-700 p-2">Fecha de Reserva</th>
            <th className="border-b border-gray-700 p-2">Fecha de Devolución</th>
            <th className="border-b border-gray-700 p-2">Multa</th>
            <th className="border-b border-gray-700 p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((prestamo) => {
            const multa = calcularMulta(prestamo.fecha_limite);
            return (
              <tr key={prestamo._id}>
                <td className="border-b border-gray-700 p-2">{prestamo.codigo_pre}</td>
                <td className="border-b border-gray-700 p-2">{prestamo.nombre_libro}</td>
                <td className="border-b border-gray-700 p-2">{prestamo.nombre_usuario}</td>
                <td className="border-b border-gray-700 p-2">
                  {new Date(prestamo.fecha_reserva).toLocaleDateString()}
                </td>
                <td className="border-b border-gray-700 p-2">
                  {new Date(prestamo.fecha_limite).toLocaleDateString()}
                </td>
                <td className="border-b border-gray-700 p-2">{multa > 0 ? `${multa} días` : "Sin multa"}</td>
                <td className="border-b border-gray-700 p-2">
                  <button
                    onClick={() => handleDevolver(prestamo._id, multa)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Devolver
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-600 text-white rounded mr-2 disabled:opacity-50"
        >
          Anterior
        </button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => setCurrentPage(page + 1)}
            className={`px-4 py-2 ${
              page + 1 === currentPage ? "bg-blue-500" : "bg-gray-600"
            } text-white rounded mx-1`}
          >
            {page + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-600 text-white rounded ml-2 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Historial;
