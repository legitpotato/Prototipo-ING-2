import PropTypes from 'prop-types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Principal from './pages/PagPrincipal';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PagDoc from './pages/PagDoc';
import RegistroDoc from './pages/PagRegistroDoc';
import Catalogo from './pages/Catalogo';
import DetallesDoc from './pages/DetallesDoc';
import Documentos from './pages/Documentos';

import ResetPasswordPage from './pages/ResetPasswordPage'; //Página reset password

import PagAdmin from './components/PagAdmin';

import PagPagos from './pages/PagPagos';

import Carrito from './pages/carrito'; //Pagina carrito

import ProtectedRoute from './ProtectedRoute'; // Componente para proteger rutas
import { TaskProvider } from './context/TasksContext'; // Proveedor de contexto de tareas
import Navbar from './components/Navbar'; // Componente de la barra de navegación
import Footer from './components/Footer'; // Componente de pie de página

import Historial from './pages/Historial'; // Página de historial
import Usuarios from './pages/Usuarios'; // Página de gestión de usuarios


// Layout para las páginas administrativas
const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <PagAdmin /> {/* Barra lateral de administración */}
      <div className="ml-64 flex-1">{children}</div> {/* Contenido de la ruta */}
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <header>
              <Navbar />
            </header>

            <main className="flex-grow container mx-auto px-10">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Principal />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/detalle/:id" element={<DetallesDoc />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/pagos" element={<PagPagos />} />
                <Route path="/carrito" element={<Carrito />} />

                {/* Rutas protegidas */}
                <Route element={<ProtectedRoute />}>          
                {/* Rutas administrativas con layout */}
                <Route path="/añadir-doc" element={<AdminLayout><RegistroDoc /></AdminLayout>} />
                <Route path="/editar-doc" element={<AdminLayout><PagDoc /></AdminLayout>} />
                <Route path="/eliminar-doc" element={<AdminLayout><Documentos /></AdminLayout>} />
                <Route path="/tasks/:id" element={<AdminLayout><RegistroDoc /></AdminLayout>} />
                <Route path="/prestamos" element={<AdminLayout><Historial /></AdminLayout>} />
                <Route path="/principal" element={<AdminLayout><Principal /></AdminLayout>} />
                <Route path="/usuarios" element={<AdminLayout><Usuarios /></AdminLayout>} />
                </Route>
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
