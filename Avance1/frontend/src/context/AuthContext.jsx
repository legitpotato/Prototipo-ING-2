import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verityTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

// Crear el contexto
export const AuthContext = createContext();

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);


 
  const signup = async ({ email, password }, additionalData) => {
    try {
      // 1. Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Obtener token de Firebase
      const token = await user.getIdToken();

      // 3. Enviar datos adicionales a tu backend
      const res = await fetch("https://tu-api.com/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          ...additionalData
        })
      });

      const userData = await res.json();
      setUser(userData);
      setIsAuthenticated(true);
      setErrors([]);
    } catch (error) {
      handleError(error);
    }
  };
  


  // Iniciar sesión
  const signin = async (userData) => {
    try {
      const res = await loginRequest(userData);
      setUser(res.data);
      setIsAuthenticated(true);
      setErrors([]);
    } catch (error) {
      handleError(error);
    }
  };

  // Cerrar sesión
  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Manejo de errores
  const handleError = (error) => {
    if (error.response?.data) {
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      } else if (typeof error.response.data === "object") {
        setErrors([error.response.data.message || "Error desconocido"]);
      } else {
        setErrors([error.response.data]);
      }
    } else {
      setErrors(["Error de conexión con el servidor"]);
    }
  };

  // Limpieza automática de errores después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Verifica token al montar el componente
  useEffect(() => {
    const checkLogin = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return setLoading(false);
      }

      try {
        const res = await verityTokenRequest(token);
        if (!res.data) throw new Error("Token inválido");
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token inválido o expirado:", error);
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove("token");
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
