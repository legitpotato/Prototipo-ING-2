import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Aquí se incluye useLocation
import { useTasks } from "../context/TasksContext"; // Contexto para obtener las tareas
import DocCard from "../components/DocCard"; // Componente para mostrar cada documento

function Catalogo() {
  const { getTasks, tasks } = useTasks(); // Obtener las tareas del contexto
  const [mostrarFiltro, setMostrarFiltro] = useState(false); // Estado para mostrar/ocultar el filtro
  const [mostrarBuscar, setMostrarBuscar] = useState(false); // Estado para mostrar/ocultar el campo de búsqueda
  const [searchAuthor, setSearchAuthor] = useState(""); // Estado para el campo de búsqueda de autor
  const [searchTitle, setSearchTitle] = useState(""); // Estado para el campo de búsqueda de título
  const [searchCategory, setSearchCategory] = useState(""); // Estado para el campo de búsqueda de categoría
  const [filteredTasks, setFilteredTasks] = useState(tasks); // Lista de tareas filtradas

  // Paginación
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const itemsPerPage = 12; // Número de elementos por página

  // Hook para la navegación
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getTasks(); // Obtener las tareas al montar el componente
  }, []);

  useEffect(() => {
    // Filtrar tareas por autor, título y categoría
    let filtered = tasks;
    if (searchAuthor !== "") {
      filtered = filtered.filter((task) =>
        task.autor.toLowerCase().includes(searchAuthor.toLowerCase())
      );
    }
    if (searchTitle !== "") {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    if (searchCategory !== "") {
      filtered = filtered.filter(
        (task) => task.categoria.toLowerCase() === searchCategory.toLowerCase()
      );
    }
    setFilteredTasks(filtered); // Actualizar la lista de tareas filtradas
  }, [searchAuthor, searchTitle, searchCategory, tasks]);

  // Paginación: Calcular el índice de inicio y fin de los elementos a mostrar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  // Cambiar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // Actualizar la página actual
  };

  // Navegar a la página siguiente
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Navegar a la página anterior
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const [successMessage, setSuccessMessage] = useState(""); // Estado para almacenar el mensaje de éxito

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage); // Mostrar mensaje de éxito si viene en el estado de la ruta
    }
  }, [location]);

  return (
    <div>
      {successMessage && (
        <div className="alert bg-green-500 text-white p-4 rounded-md">
          {successMessage}
        </div>
      )}
      <section
        className="bg-gray-800 bg-opacity-80 mt-14 mb-14 item rounded-lg"
        style={{ backgroundImage: "url('../src/imagenes/fondolargo.png')" }} // Fondo del catálogo
      >
        <div className="container mx-auto flex flex-wrap items-center pt-4 pb-2">
          <nav className="w-full px-10 py-10 z-30">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <h1 className="uppercase font-bold text-5xl text-white px-2 py-2 mx-auto bg-gray-600 rounded-lg font-mono">
                  CATÁLOGO
                </h1>
              </div>
              <div className="flex space-x-10">
                {/* Botón para mostrar/ocultar el filtro */}
                <button
                  onClick={() => setMostrarFiltro(!mostrarFiltro)}
                  className="bg-gray-600 hover:bg-red-600 text-white px-6 py-4 rounded-md mt-5 font-mono font-bold"
                >
                  Filtro
                </button>
              </div>
            </div>
          </nav>

          {/* Filtros de búsqueda */}
          {mostrarFiltro && (
            <div className="w-4/5 bg-gray-700 p-4 rounded-lg mb-6 mx-auto">
              <h2 className="text-xl font-bold mb-2 font-mono">
                Filtrar documentos por:
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block font-semibold font-mono">Título:</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md font-mono text-gray-950"
                    value={searchTitle}
                    placeholder="Busca por Título..."
                    onChange={(e) => setSearchTitle(e.target.value)} // Actualizar estado del título
                  />
                </div>
                <div>
                  <label className="block font-semibold font-mono">Autor:</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md font-mono text-gray-950"
                    value={searchAuthor}
                    placeholder="Busca por Autor..."
                    onChange={(e) => setSearchAuthor(e.target.value)} // Actualizar estado del autor
                  />
                </div>
                <div>
                  <label className="block font-semibold font-mono">
                    Categoría:
                  </label>
                  <select
                    className="w-full p-2 border rounded-md font-mono text-gray-950"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)} // Actualizar estado de la categoría
                  >
                    <option value="">Elige una Categoría...</option>
                    <option value="Antiguo">Antiguo</option>
                    <option value="Anime">Anime</option>
                    <option value="Arte">Arte</option>
                    <option value="Fantasía">Fantasía</option>
                    <option value="Infantil">Infantil</option>
                    <option value="Ingenieria">Ingeniería</option>
                    <option value="Romance">Romance</option>
                    <option value="Suspenso">Suspenso</option>
                    <option value="Terror">Terror</option>
                  </select>
                </div>
              </form>
            </div>
          )}

          {/* Barra de búsqueda rápida */}
          {mostrarBuscar && (
            <div className="w-4/5 bg-gray-100 p-4 rounded-lg mb-6 mx-auto font-mono">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  className="flex-grow p-2 border rounded-md font-mono mr-2 text-gray-950"
                />
                <button className="bg-gray-600 hover:bg-red-600 text-white px-4 py-2 rounded-md font-mono font-bold">
                  Buscar
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Listado de documentos */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-10">
        {currentItems.map((task) => (
          <div key={task._id} onClick={() => navigate(`/detalle/${task._id}`)}> {/* Navegación al detalle */}
            <DocCard task={task} />
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          Anterior
        </button>

        {/* Mostrar números de página */}
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => handlePageChange(page + 1)}
            className={`px-4 py-2 mx-1 rounded-md ${
              currentPage === page + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {page + 1}
          </button>
        ))}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Catalogo;
