import { useForm } from 'react-hook-form'; // Hook para manejar formularios y validaciones
import { useAuth } from '../context/AuthContext'; // Contexto de autenticación
import { Link, useNavigate } from 'react-router-dom'; // Navegación entre rutas
import { useEffect } from 'react'; // Hook para manejar efectos secundarios

function LoginPage() {
  
  // useForm devuelve funciones para manejar el formulario y errores de validación
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // useAuth proporciona funciones y estados relacionados con la autenticación
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Función que se ejecuta al enviar el formulario
  const onSubmit = handleSubmit(data => {
    signin(data); // Llama a la función de inicio de sesión con los datos del formulario
  });

  // useEffect se ejecuta cuando cambia isAuthenticated
  useEffect(() => {
    if (isAuthenticated) navigate("/"); // Si el usuario está autenticado, redirige a la página principal
  }, [isAuthenticated, navigate]);

  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
        
        {/* Muestra errores de inicio de sesión */}
        {signinErrors.map((error, i) => (
          <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
            {error}
          </div>
        ))}
        
        <h1 className='text-3xl font-bold my-2'>Inicia Sesión</h1>

        {/* Formulario de inicio de sesión */}
        <form onSubmit={onSubmit}>
          
          {/* Campo de correo electrónico */}
          <input
            type="email"
            {...register("correo", { required: true })} // Registro del campo en useForm con validación requerida
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Correo"
          />
          {errors.correo && (
            <p className="text-red-500">Se requiere Correo</p> // Muestra mensaje de error si no se ingresa el correo
          )}

          {/* Campo de contraseña */}
          <input
            type="password"
            {...register("contraseña", { required: true })} // Registro del campo en useForm con validación requerida
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Contraseña"
          />
          {errors.contraseña && (
            <p className="text-red-500">Se requiere Contraseña</p> // Muestra mensaje de error si no se ingresa la contraseña
          )}

          {/* Botón para enviar el formulario */}
          <button type="submit" className='bg-sky-500 text-white px-4 py-2 rounded-md my-2'>
            Iniciar Sesión
          </button>
        </form>

        {/* Enlace para redirigir a la página de registro */}
        <p className='flex gap-x-2 justify-between'>
          No tienes una cuenta?{" "}
          <Link to="/register" className='text-sky-500'>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
