import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Hook personalizado para el contexto de autenticación.
import axios from "axios"; // Usamos axios para hacer las solicitudes HTTP.

const Carrito = () => {
  const { isAuthenticated, user } = useAuth(); // Obtener usuario autenticado
  const [prestamos, setPrestamos] = useState([]); // Estado para almacenar los préstamos
  const [carrito, setCarrito] = useState([]); // Estado para el carrito

  useEffect(() => {
    if (isAuthenticated && user && user.id) { // Verifica que el usuario esté autenticado y que 'user.id' esté disponible
      const fetchPrestamos = async () => {
        try {
          // Realiza la solicitud a la API, pasando el user.id para filtrar los préstamos por el id_user
          const response = await axios.get(`http://localhost:4000/api/prestamos/user/${user.id}`, {
            withCredentials: true, // Asegúrate de incluir las credenciales (cookies)
          });
  
          // Se obtienen todos los préstamos sin filtrar por el atributo 'carrito'
          setPrestamos(response.data);
        } catch (error) {
          console.error("Error al obtener los préstamos", error.response ? error.response.data : error);
        }
      };
      fetchPrestamos();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Mapear los préstamos a las filas del carrito
    const carritoItems = prestamos.map((prestamo, index) => ({
      id: index + 1, // Usamos el índice como ID único temporal
      nombre_libro: prestamo.nombre_libro,
      fecha_limite: formatFecha(prestamo.fecha_limite), // Formatear fecha
      cantidad: 1, // Siempre es 1
    }));
    setCarrito(carritoItems);
  }, [prestamos]);

  // Función para formatear fecha a DIA-MES-AÑO
  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };

  return (
    <div className="flex justify-center w-full mt-20">
      <div className="flex w-full max-w-screen-lg justify-between space-x-4">
        <div className="bg-zinc-800 p-6 rounded-xl shadow-lg text-white">
          <div className="flex border-b border-gray-400">
            <div className="flex-1 text-center p-4 cursor-pointer font-semibold bg-zinc-600 text-white">
              Préstamo
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-bold">Préstamo de libros</h3>
            <p className="mt-2">Lista de libros agregados al carrito:</p>

            <div className="mt-4 flex justify-center">
              <table className="min-w-full divide-y divide-gray-200 mx-[160px]">
                <thead>
                  <tr>
                    <th className="bg-zinc-600 text-center align-middle">#</th>
                    <th className="bg-zinc-600 text-center align-middle">Nombre del libro</th>
                    <th className="bg-zinc-600 text-center align-middle">Fecha de devolución</th>
                    <th className="bg-zinc-600 text-center align-middle">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center align-middle">{index + 1}</td>
                      <td className="text-center align-middle">{item.nombre_libro}</td>
                      <td className="text-center align-middle">{item.fecha_limite}</td>
                      <td className="text-center align-middle">{item.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 p-6 rounded-xl shadow-lg text-white flex flex-col items-center justify-between w-[500px]">
          <h3 className="text-xl font-bold">Resumen de libros</h3>
          <div className="mt-4">
            <div className="p-2 bg-zinc-700 rounded-md text-center">
              <h4 className="font-semibold">Cantidad total: {carrito.length}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
