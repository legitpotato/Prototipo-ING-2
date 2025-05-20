import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
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
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">

        {/* Errores del backend */}
        {signinErrors.length > 0 &&
          signinErrors.map((error, i) => (
            <div key={i} className="bg-red-500 p-2 text-white text-center my-2 rounded">
              {error}
            </div>
          ))}

        <h1 className="text-3xl font-bold text-center mb-6">Inicia Sesión</h1>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Correo */}
          <input
            type="email"
            {...register('correo', { required: 'El correo es requerido' })}
            placeholder="Correo"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          />
          {formErrors.correo && (
            <p className="text-red-400 text-sm">{formErrors.correo.message}</p>
          )}

          {/* Contraseña */}
          <input
            type="password"
            {...register('contraseña', { required: 'La contraseña es requerida' })}
            placeholder="Contraseña"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          />
          {formErrors.contraseña && (
            <p className="text-red-400 text-sm">{formErrors.contraseña.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 transition-colors text-white px-4 py-2 rounded-md my-4"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-sm text-center">
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
