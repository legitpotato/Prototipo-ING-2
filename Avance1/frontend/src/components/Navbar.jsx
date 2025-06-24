import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useComunidad } from "../context/ComunidadContext";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { comunidades, comunidadActiva, setComunidadActiva } = useComunidad();
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        console.log("🔐 Firebase Token:", token);
      } else {
        console.log("⚠️ No hay usuario autenticado.");
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <nav className="bg-[#0097b2] text-white px-4 py-3 shadow-md relative">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo y título */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <img src="/src/assets/logoComuniRed.png" alt="Logo" className="h-12" />
            <h1 className="ml-2 text-xl font-bold">ComuniRed</h1>
          </Link>
        </div>

        {/* Botón hamburguesa SIEMPRE visible */}
        <button
          className="text-3xl"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          {menuAbierto ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Side menu */}
        <ul
    className={`fixed top-0 left-0 h-full w-64 bg-[#0097b2] text-white p-6 z-50 transform transition-transform duration-300 ${
        menuAbierto ? "translate-x-0" : "-translate-x-full"
    }`}
    >
    <div className="flex flex-col space-y-4">
        {isAuthenticated ? (
        <>
            <li className="font-semibold">
            <Link to="/perfil" onClick={toggleMenu}>
                ¡Hola {user?.firstName || user?.displayName || user?.email}!
            </Link>
            </li>

            <li><Link to="/pagos" onClick={toggleMenu}>Mis Pagos</Link></li>

            {comunidadActiva?.rol === "DIRECTIVA" && (
            <>
                <li><Link to="/usuarios" onClick={toggleMenu}>Usuarios</Link></li>
                <li><Link to="/admin/morosidad" onClick={toggleMenu}>Morosidad</Link></li>
                <li><Link to="/admin/pagos" onClick={toggleMenu}>Pagos</Link></li>
                <li><Link to="/admin/incidencia" onClick={toggleMenu}>Incidencias</Link></li>
            </>
            )}

            {comunidades.length > 1 && (
            <li className="pt-2">
                <select
                value={comunidadActiva?.id || ""}
                onChange={(e) => {
                    const seleccionada = comunidades.find(c => c.id === e.target.value);
                    setComunidadActiva(seleccionada);
                }}
                className="text-black px-2 py-1 rounded w-full"
                >
                {comunidades.map((comunidad) => (
                    <option key={comunidad.id} value={comunidad.id}>
                    {comunidad.nombre}
                    </option>
                ))}
                </select>
            </li>
            )}

            <li className="pt-4">
            <button
                onClick={() => {
                logout();
                toggleMenu();
                }}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full"
            >
                Cerrar Sesión
            </button>
            </li>
        </>
        ) : (
        <>
            <li>
            <Link to="/login" onClick={toggleMenu} className="bg-white text-black px-4 py-2 rounded block text-center hover:bg-gray-200">
                Iniciar Sesión
            </Link>
            </li>
            <li>
            <Link to="/register" onClick={toggleMenu} className="bg-white text-black px-4 py-2 rounded block text-center hover:bg-gray-200">
                Registrarse
            </Link>
            </li>
        </>
        )}
    </div>
    </ul>
    </nav>
  );
}

export default Navbar;
