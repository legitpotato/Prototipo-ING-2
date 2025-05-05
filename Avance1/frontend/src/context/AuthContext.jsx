import { createContext, useState, useContext, useEffect } from "react"; 
import { registerRequest, loginRequest, verityTokenRequest } from '../api/auth'; 
import Cookies from 'js-cookie'; 

// Crea el contexto de autenticación
export const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estado para el usuario autenticado
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para saber si el usuario está autenticado
    const [errors, setErrors] = useState([]); // Estado para almacenar errores
    const [loading, setLoading] = useState(true); // Estado para gestionar el estado de carga

    // Función para registrar un usuario
    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            console.log(res.data);
            setUser(res.data); 
            setIsAuthenticated(true);
        } catch (error) {
            console.log(error.response);
            setErrors(error.response.data); // Almacena los errores de la respuesta
        }
    };

    // Función para iniciar sesión
    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            console.log(res);
            setIsAuthenticated(true);
            setUser(res.data);
        } catch (error) {
            console.log(error);
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data); 
            }
            setErrors([error.response.data.message]); 
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        Cookies.remove("token"); // Elimina el token almacenado en las cookies
        setIsAuthenticated(false);
        setUser(null);
    };

    // Elimina los errores automáticamente después de 5 segundos
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    // Verifica si el usuario está autenticado al cargar la página
    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();
            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                return setUser(null);  
            }
            try {
                const res = await verityTokenRequest(cookies.token); 
                if (!res.data) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }
                setIsAuthenticated(true);
                setUser(res.data); 
                setLoading(false);
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    // Proporciona el contexto de autenticación a los componentes hijos
    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            logout,
            loading,
            user,
            isAuthenticated,
            errors,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
