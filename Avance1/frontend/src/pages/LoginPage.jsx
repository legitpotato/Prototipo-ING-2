import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FloatingInput } from '../components/TextoFlotante.jsx';

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await signin(data);
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="mt-8 p-10 border border-gray-300 rounded-lg max-w-md w-full bg-white shadow-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/src/assets/logoComuniRed.png"
            alt="Logo comunidad"
            className="w-20 h-20 mb-2"
          />
          <h2 className="text-2xl font-bold text-zinc-600">¡Bienvenido vecino!</h2>
        </div>

        {signinErrors.length > 0 &&
          signinErrors.map((error, i) => (
            <div key={i} className="bg-red-100 text-red-700 p-2 text-center my-2 rounded">
              {error}
            </div>
          ))}

        <h1 className="text-3xl text-indigo-500 font-bold text-center mb-6">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FloatingInput
            label="Correo"
            type="email"
            name="email"
            register={register}
            error={errors.email}
            validation={{
              required: "Se requiere Correo Electrónico",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo inválido. Debe tener un formato como usuario@dominio.com"
              }
            }}
          />

          <FloatingInput
            label="Contraseña"
            type="password"
            name="password"
            register={register}
            error={errors.password}
            validation={{ required: "Se requiere Contraseña" }}
          />

          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white px-6 py-2 rounded-md mx-auto block"
          >
            Iniciar Sesión
          </button>

          <p className="text-sm text-center mt-2 text-black">
            ¿Olvidaste tu contraseña?{" "}
            <Link to="/reset-password" className="text-sky-400 hover:underline">
              Recuperar contraseña
            </Link>
          </p>
        </form>

        <p className="text-sm text-center text-black mt-4">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-sky-400 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
