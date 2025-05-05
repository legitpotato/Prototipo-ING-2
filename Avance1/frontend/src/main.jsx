import { StrictMode } from 'react'; // Importamos StrictMode para ayudar a identificar problemas potenciales en la app
import { createRoot } from 'react-dom/client'; // Importamos createRoot para renderizar la aplicación en el DOM
import App from './App.jsx'; // Importamos el componente principal de la aplicación
import './index.css'; // Importamos los estilos globales de la aplicación

// Renderizamos la aplicación en el DOM
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> {/* Componente principal que contiene toda la aplicación */}
  </StrictMode>,
);
