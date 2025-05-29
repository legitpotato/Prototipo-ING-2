import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log("isAuthenticated:", isAuthenticated);
  console.log("user completo:", user);

  if (loading) return <p>Cargando...</p>;

  // Intentar obtener el rol desde distintas propiedades posibles
  const role = user?.rol || user?.role || user?.userRole;

  console.log("Rol detectado:", role);

  if (!isAuthenticated || role !== "admin") {
    console.log("No es admin, redirigiendo...");
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
