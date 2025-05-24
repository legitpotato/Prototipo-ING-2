import { createContext, useState, useContext, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

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

  // Registrar nuevo usuario
  const signup = async ({ email, password }, additionalData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      const res = await fetch("http://localhost:4000/api/usuarios", {
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

  
  const signin = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      const res = await fetch("http://localhost:4000/api/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await res.json();
      setUser(userData);
      setIsAuthenticated(true);
      setErrors([]);
    } catch (error) {
      handleError(error);
    }
  };


  // Cerrar sesión
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Manejo de errores
  const handleError = (error) => {
    if (error.code) {
      setErrors([error.message]);
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

  // Verifica el estado de autenticación al montar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setErrors([]);
    } catch (error) {
      handleError(error);
    }
  };

  
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
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
