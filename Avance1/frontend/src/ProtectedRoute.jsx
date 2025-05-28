import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute() {
    const { loading, isAuthenticated } = useAuth();

    if (loading) return <h1>Cargando...</h1>;

    // Si no está autenticado, lo enviamos a la página de bienvenida
    if (!isAuthenticated) return <Navigate to="/principal" replace />;

    // Si está autenticado, renderiza las rutas hijas
    return <Outlet />;
}

export default ProtectedRoute;
