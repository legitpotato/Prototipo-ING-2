import { Navigate, Outlet } from "react-router-dom"; // Importamos los componentes necesarios de react-router-dom para navegación y renderizado de rutas hijas
import { useAuth } from "./context/AuthContext"; // Importamos el hook useAuth para acceder al contexto de autenticación

function ProtectedRoute() {
    const { loading, isAuthenticated } = useAuth(); // Extraemos el estado de carga y la autenticación desde el contexto
    const { user } = useAuth(); // Extraemos el usuario desde el contexto de autenticación

    // Si los datos están cargando, mostramos un mensaje de "Cargando..."
    if (loading) return <h1>Cargando...</h1>;

    // Si no está autenticado, redirige a la página de login
    if (!loading && !isAuthenticated) return <Navigate to='/login' replace />;

    // Si el usuario no es admin, redirige al inicio (o alguna otra página de acceso restringido)
    if (!user.admin) {
        return <Navigate to="/" />;
    }

    // Si todo está bien (usuario autenticado y con rol de admin), renderiza las rutas hijas
    return <Outlet />;
}

export default ProtectedRoute;
