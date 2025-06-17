import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComunidadProvider } from './context/ComunidadContext'; // Asegúrate de que la ruta sea correcta
import ProtectedRoute from './ProtectedRoute';

import BienvenidaPage from './pages/BienvenidaPage';
import Principal from './pages/PagPrincipal';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PagPagos from './pages/PagPagos';
import Usuarios from './pages/Usuarios';
import AdminRoute from "./AdminRoute";
import PagPagosDirectiva from "./pages/PagPagosDirectiva";
import PagosTodosPage from './pages/PagosTodosPage';
import MorosidadPage from './pages/morosidadPage';
import GestionUsuariosPage from './pages/GestionUsuariosPage';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <ComunidadProvider> {/* 👈 Aquí envolvemos toda la app */}
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <header>
              <Navbar />
            </header>

            <main className="flex-grow container mx-auto px-10">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/principal" element={<BienvenidaPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Ruta accesible por cualquier usuario autenticado */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Principal />} />
                  <Route path="/morosidad" element={<MorosidadPage />} />
                </Route>

                <Route path="/admin/pagos" element={<AdminRoute><PagPagosDirectiva /></AdminRoute>} />

                {/* Ruta para residentes */}
                <Route path="/pagos" element={<ProtectedRoute requiredRole={['admin', 'vecino']} />}>
                  <Route index element={<PagPagos />} />
                </Route>

                {/* Ruta para directiva */}
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                  <Route path="/usuarios" element={<Usuarios />} />
                </Route>
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                  <Route path="/pagos/todos" element={<PagosTodosPage />} />
                </Route>
                <Route element={<ProtectedRoute requiredRole={['admin', 'directiva']} />}>
                  <Route path="/usuarios/gestionar" element={<GestionUsuariosPage />} />
                </Route>
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </ComunidadProvider>
    </AuthProvider>
  );
}

export default App;
