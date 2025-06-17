import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ComunidadContext = createContext();

export const useComunidad = () => useContext(ComunidadContext);

export const ComunidadProvider = ({ children }) => {
  const [comunidades, setComunidades] = useState([]);
  const [comunidadActiva, setComunidadActiva] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const res = await fetch('/api/comunidades/mis-comunidades', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (Array.isArray(data) && data.length > 0) {
            // Transformar comunidades para asegurar que tengan un campo `id`
            const comunidadesTransformadas = data.map((c) => ({
              ...c,
              id: c.comunidadId || c.id,
            }));

            setComunidades(comunidadesTransformadas);
            setComunidadActiva(comunidadesTransformadas[0]); // Selecciona la primera como activa
          } else {
            setComunidades([]);
            setComunidadActiva(null);
          }
        } catch (error) {
          console.error('Error al cargar comunidades:', error);
        }
      } else {
        setComunidades([]);
        setComunidadActiva(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ComunidadContext.Provider value={{ comunidades, comunidadActiva, setComunidadActiva }}>
      {children}
    </ComunidadContext.Provider>
  );
};
