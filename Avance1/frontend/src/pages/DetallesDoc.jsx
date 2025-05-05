import { useParams, useNavigate } from "react-router-dom"; // Importa hooks para obtener parámetros de la URL y manejar navegación
import { useTasks } from "../context/TasksContext"; // Importa el contexto de tareas para acceder a los documentos
import { useState } from "react"; // Hook para manejar el estado local
import User from "../../../backend/models/user.model" //Importa el modelo de usuario
import { useAuth } from "../context/AuthContext";
import Comprobante from '../components/Comprobante';

const DetallesDoc = () => {
  const { id } = useParams(); // Obtiene el ID del documento desde la URL
  const { tasks } = useTasks(); // Obtiene la lista de tareas desde el contexto
  const navigate = useNavigate(); // Hook para navegar entre páginas
  const [returnDate, setReturnDate] = useState(""); // Estado para almacenar la fecha de devolución ingresada
  const [error, setError] = useState(""); // Estado para manejar mensajes de error

  // Obtener el usuario actual
  const currentUserId = User._id;

  const { user } = useAuth();

  // Obtener la fecha máxima de préstamo (2 semanas desde hoy)
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 14); // Suma 14 días a la fecha actual

  // Busca el documento correspondiente al ID
  const task = tasks.find((task) => task._id === id);

  // Muestra un mensaje si el documento no se encuentra
  if (!task) {
    return <h1 className="text-white text-center">Documento no encontrado</h1>;
  }

  const handleConfirm = async () => {
    if (!user) {
      alert("Debe iniciar sesión para realizar una reserva.");
      navigate("/login");
      return;
    }
  
    if (!returnDate) {
      setError("Debe ingresar una fecha de devolución.");
      return;
    }
  
    const selectedDate = new Date(returnDate);
    if (selectedDate > maxDate) {
      setError(`La fecha no puede superar el ${maxDate.toLocaleDateString()}.`);
      return;
    }
  
    setError("");
  
    const reservaData = {
      id_user: user.id,
      id_libro: task._id,
      nombre_usuario: user.nombre,
      nombre_libro: task.title,
      fecha_reserva: today.toISOString(),
      fecha_limite: selectedDate.toISOString(),
    };
  
    try {
      const response = await fetch("http://localhost:4000/api/prestamos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reservaData),
      });
  
      if (response.ok) {
        const data = await response.json(); // Datos del backend, incluyendo codigo_pre
        console.log("Reserva confirmada:", data);
        alert("Reserva realizada con éxito.");
  
        const adjustedDate = new Date(
          selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000
        );
  
        Comprobante({
          usuario: { nombre: user.nombre },
          documento: { title: task.title },
          codigo_pre: data.codigo_pre, // Usamos el código de préstamo
          fechaInicio: today.toLocaleDateString(),
          fechaDevolucion: adjustedDate.toLocaleDateString(),
        });
  
        navigate(-1);
      } else {
        const errorData = await response.json();
        if (errorData.message === "No hay ejemplares disponibles para este libro") {
          alert("No quedan ejemplares disponibles para este libro.");
        } else {
          alert("Hubo un error al realizar la reserva.");
        }
        console.error("Error al realizar la reserva:", errorData);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <div className="flex">
          {/* Imagen del documento */}
          <div className="w-1/3 pr-4 mr-6">
            <img
              src={task.imgURL}
              alt={task.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Detalles del documento */}
          <div className="w-2/3 text-white">
            <h2 className="text-3xl font-bold mb-4">{task.title}</h2>
            <p><strong>Autor:</strong> {task.autor}</p>
            <p><strong>Tipo de Documento:</strong> {task.tipodoc}</p>
            <p><strong>Editorial:</strong> {task.editorial}</p>
            <p><strong>Edición:</strong> {task.edicion}</p>
            <p><strong>Categoría:</strong> {task.categoria}</p>
            <p><strong>Año de Edición:</strong> {task.anoedicion}</p>
            <p><strong>Ejemplares disponibles:</strong> {task.cantidad}</p>
            <p><strong>Resumen:</strong> {task.resumen}</p>

            {/* Campo para seleccionar la fecha de devolución */}
            <div className="mt-6">
              <label htmlFor="returnDate" className="block text-sm font-medium mb-2">
                Fecha de devolución (máximo 2 semanas desde hoy):
              </label>
              <input
                type="date"
                id="returnDate"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 text-white"
              />
              {error && <p className="text-red-500 mt-2">{error}</p>} {/* Muestra el mensaje de error si existe */}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleConfirm} // Llama a la función de confirmación
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-bold"
          >
            Confirmar reserva
          </button>
          <button
            onClick={() => navigate(-1)} // Navega a la página anterior
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-bold"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesDoc;
