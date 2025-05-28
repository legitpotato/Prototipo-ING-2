import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="mt-8 p-10 border border-gray-300 rounded-lg max-w-md w-full bg-white shadow-md">
        {/* Imagen y mensaje de bienvenida */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="\src\assets\logoComuniRed.png"
            alt="Logo comunidad"
            className="w-20 h-20 mb-2"
          />
          <h2 className="text-2xl font-bold text-zinc-600">¡Bienvenido a ComuniRed!</h2>
        </div>

        <p className="text-lg text-center text-gray-600 mb-6">Elige una opción para continuar:</p>

        <div className="space-y-4">
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 transition-colors text-white px-6 py-2 rounded-md mx-auto block text-center"
          >
            ¿Eres nuevo? ¡Regístrate!
          </Link>
          <Link
            to="/login"
            className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white px-6 py-2 rounded-md mx-auto block text-center"
          >
            ¿Ya tienes una cuenta? ¡Inicia sesión!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
