import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PagAdmin() {
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar la visibilidad de la barra lateral
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsVisible(!isVisible); // Alterna entre visible y oculto
  };

  return (
    <div>
      {/* Botón de menú para mostrar/ocultar la barra lateral */}
      <button
        className="fixed top-30 left-4 z-50 bg-black text-white mt-6 mb-2 p-2 rounded-md shadow-md hover:bg-gray-800 transition-all duration-300"
        onClick={toggleSidebar}
      >
        {isVisible ? "Cerrar Menú" : "Abrir Menú"}
      </button>

      {/* Barra lateral */}
      {isVisible && (
        <div
          className="fixed top-40 left-4 bottom-20 w-64 bg-black bg-opacity-80 text-white z-50 shadow-lg flex flex-col"
          style={{
            borderRadius: "10px", // Opcional: bordes redondeados
          }}
        >
          <ul className="list-none p-4 space-y-4">
          <li
              className="hover:bg-white hover:text-black p-2 rounded-md cursor-pointer transition-all duration-300"
              onClick={() => navigate("/añadir-doc")}
            >
              Añadir Documento
            </li>
            <li
              className="hover:bg-white hover:text-black p-2 rounded-md cursor-pointer transition-all duration-300"
              onClick={() => navigate("/editar-doc")}
            >
              Editar Documento
            </li>
            <li
              className="hover:bg-white hover:text-black p-2 rounded-md cursor-pointer transition-all duration-300"
              onClick={() => navigate("/eliminar-doc")}
            >
              Eliminar Documento
            </li>  
            <li
              className="hover:bg-white hover:text-black p-2 rounded-md cursor-pointer transition-all duration-300"
              onClick={() => navigate("/prestamos")}
            >
              Buscar Préstamo
            </li>
            <li
              className="hover:bg-white hover:text-black p-2 rounded-md cursor-pointer transition-all duration-300"
              onClick={() => navigate("/usuarios")}
            > 
              Usuarios
            </li>
            <li
              className="hover:bg-white hover:text-black p-2 rounded-md cursor-pointer transition-all duration-300"
              onClick={() => navigate("/")}
            > 
              Inicio
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default PagAdmin;
