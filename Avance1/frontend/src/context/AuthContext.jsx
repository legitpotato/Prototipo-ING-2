import { createContext, useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Datos desde backend
  const [firebaseUser, setFirebaseUser] = useState(null); // Usuario Firebase
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleError = (error) => {
    if (error.code) {
      setErrors([error.message]);
    } else {
      setErrors(["Error de conexión con el servidor"]);
    }
  };

  const signup = async ({ email, password }, additionalData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fUser = userCredential.user;
      const token = await fUser.getIdToken();

      const res = await fetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: fUser.uid,
          email: fUser.email,
          ...additionalData,
        }),
      });

      const userData = await res.json();
      setFirebaseUser(fUser);
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
      const fUser = userCredential.user;
      const token = await fUser.getIdToken();

      const res = await fetch("http://localhost:4000/api/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await res.json();
      setFirebaseUser(fUser);
      setUser(userData);
      setIsAuthenticated(true);
      setErrors([]);
    } catch (error) {
      handleError(error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setErrors([]);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      if (fUser) {
        try {
          const token = await fUser.getIdToken();

          const res = await fetch("http://localhost:4000/api/perfil", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error("Error al obtener perfil");

          const userData = await res.json();
          setFirebaseUser(fUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error cargando perfil en onAuthStateChanged:", error);
          setFirebaseUser(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user, // datos backend
        firebaseUser, // objeto Firebase con getIdToken()
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
