import { Link } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; 

function Navbar() {
    const { isAuthenticated, logout, user } = useAuth(); 
    console.log(user);

    return (
        <nav className="w-full h-20 bg-zinc-800 flex justify-between items-center px-5">
            {/* Sección izquierda: Logo, título y botón de catálogo */}
            <div className="flex items-center"> 
                <a href="/" className="flex items-center">
                    <img 
                        src="\src\assets\logoB.png" 
                        alt="Logo" 
                        className="h-16 cursor-pointer" 
                    />
                </a>
                <Link to="/" className="ml-4">
                    <h1 className="text-2xl font-bold">
                        Biblioteca Estación Central
                    </h1>
                </Link>
                <button 
                    onClick={() => location.href='/catalogo'} 
                    className="bg-gray-700 text-white px-6 py-3 ml-10 rounded-md hover:bg-gray-600 font-mono"
                >
                    CATÁLOGO
                </button>
            </div>

            {/* Sección derecha: Enlaces de navegación */}
            <ul className="flex gap-x-2 items-center">
                <li className="mr-8">
                    <Link to="/carrito">
                        <img 
                            src="/src/assets/cart_icon.png" 
                            alt="Carrito" 
                            className="h-8 cursor-pointer hover:opacity-80" 
                        />
                    </Link>
                </li>

                {isAuthenticated ? (
                    <>
                        <li className="font-bold text-lg mr-8">
                            <Link 
                                to="/perfil" 
                                className="hover:underline hover:text-blue-500"
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
                                className="hover:underline hover:text-red-500 px-4 py-1 rounded-sm" 
                                onClick={() => { logout(); }}
                            >
                                Salir
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link 
                                to='/login' 
                                className="bg-zinc-500 hover:bg-zinc-600 px-4 py-1 rounded-sm"
                            >
                                Iniciar Sesión
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to='/register' 
                                className="bg-zinc-500 hover:bg-zinc-600 px-4 py-1 rounded-sm"
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

