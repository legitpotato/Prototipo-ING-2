import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const PagPagosDirectiva = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  const fetchPagos = async () => {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        setError("No hay usuario autenticado");
        setLoading(false);
        return;
      }
setPagos
      const token = await firebaseUser.getIdToken();
      console.log("Token de usuario:", token);

      const res = await fetch("http://localhost:4000/api/pagos/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener pagos");
      }

      const data = await res.json();
      console.log("Respuesta del backend:", data);
      setPagos(data);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Error inesperado");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  if (loading) return <p>Cargando pagos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-black">Pagos de la Directiva</h2>
      <ul>
        {pagos.length === 0 && <li className="text-black">No hay pagos registrados</li>}
        {pagos.map((pago) => (
          <li key={pago.id}>
            {pago.descripcion} - Monto: ${pago.monto} - Fecha: {new Date(pago.fecha).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PagPagosDirectiva;
