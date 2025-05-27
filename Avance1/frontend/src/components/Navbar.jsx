import { Link } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; 

function Navbar() {
    const { isAuthenticated, logout, user } = useAuth(); 
    console.log(user);

    return (
        <nav className="w-full h-20 bg-[#0097b2] flex justify-between items-center px-5">
            {/* Sección izquierda: Logo, título y botón de catálogo */}
            <div className="flex items-center"> 
                <a href="/" className="flex items-center">
                    <img 
                        src="\src\assets\logoComuniRed.png" 
                        alt="Logo" 
                        className="h-16 cursor-pointer" 
                    />
                </a>
                <Link to="/" className="ml-4">
                    <h1 className="text-2xl font-bold">
                        ComuniRed
                    </h1>
                </Link>
            </div>

            {/* Sección derecha: Enlaces de navegación */}
            <ul className="flex gap-x-2 items-center">
                {isAuthenticated ? (
                    <>
                        <li className="font-bold text-lg mr-8">
                            <Link 
                                to="/perfil" 
                                className="hover:underline hover:text-black"
                            >
                                ¡Bienvenido {user?.firstName}!
                            </Link>
                        </li>

                        {user?.role == 'directiva' && (
                            <>
                                <li className="mr-6">
                                    <Link 
                                        to='/añadir-doc' 
                                        className="bg-zinc-500 hover:bg-zinc-600 px-4 py-1 rounded-sm"
                                    >
                                        Panel de Administración
                                    </Link>
                                </li>
                            </>
                        )}

                        <li>
                            <Link 
                                to='/' 
                                className="font-bold hover:underline hover:text-red-500 px-4 py-1 rounded-sm" 
                                onClick={() => { logout(); }}
                            >
                                Cerrar Sesión
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link 
                                to='/login' 
                                className="bg-zinc-400 hover:bg-zinc-500 px-4 py-1 rounded-sm"
                            >
                                Iniciar Sesión
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to='/register' 
                                className="bg-zinc-400 hover:bg-zinc-500 px-4 py-1 rounded-sm"
                            >
                                Registrarse
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;

