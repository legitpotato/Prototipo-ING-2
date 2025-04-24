import { useForm } from 'react-hook-form'; // Importamos el hook para manejar el formulario y validaciones
import { useAuth } from '../context/AuthContext'; // Importamos el contexto de autenticación para obtener las funciones de registro y verificar el estado de autenticación
import { useEffect, useState } from 'react'; // Importamos los hooks de React para manejar efectos y estado
import { useNavigate, Link } from 'react-router-dom'; // Importamos hooks para la navegación y para crear enlaces
import axios from 'axios'; // Importamos Axios para hacer solicitudes HTTP (aunque no se usa explícitamente en este código)

function RegisterPage() {
    // Configuración del formulario usando react-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, errors: registerErrors } = useAuth(); // Obtenemos las funciones y el estado del contexto de autenticación
    const navigate = useNavigate(); // Función para redirigir al usuario

    // useEffect para redirigir a la página de tareas si el usuario ya está autenticado
    useEffect(() => {
        if (isAuthenticated) navigate('/'); // Si el usuario está autenticado, lo redirigimos a /tasks
    }, [isAuthenticated]);

    // Función que se ejecuta al enviar el formulario
    const onSubmit = handleSubmit(async (values) => {
        // Añadimos 'admin: false' a los datos antes de llamar al signup
        const dataToSend = { ...values, admin: false };
        await signup(dataToSend); // Llamamos a la función signup del contexto de autenticación
    });

    return (
        <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
            <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
                {/* Mostrar errores de registro, si existen */}
                {
                    registerErrors.map((error, i) => (
                        <div className='bg-red-500 p-2 text-white' key={i}>
                            {error}
                        </div>
                    ))
                }
                <h1 className='text-3xl font-bold my-2'>Registrate</h1>
                <form onSubmit={onSubmit}>
                    {/* Campo Rut */}
                    <input
                        type="text"
                        {...register("rut", { required: true })} // Validamos que el campo 'rut' sea obligatorio
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Rut"
                    />
                    {errors.rut && <p className="text-red-500">Se requiere Rut</p>}

                    {/* Campo Nombre */}
                    <input
                        type="text"
                        {...register("nombre", { required: true })} // Validamos que el campo 'nombre' sea obligatorio
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Nombre"
                    />
                    {errors.nombre && <p className="text-red-500">Se requiere Nombre</p>}

                    {/* Campo Apellido */}
                    <input
                        type="text"
                        {...register("apellido", { required: true })} // Validamos que el campo 'apellido' sea obligatorio
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Apellido"
                    />
                    {errors.apellido && <p className="text-red-500">Se requiere Apellido</p>}

                    {/* Campo Dirección */}
                    <input
                        type="text"
                        {...register("direccion", { required: true })} // Validamos que el campo 'direccion' sea obligatorio
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Direccion"
                    />
                    {errors.direccion && <p className="text-red-500">Se requiere Direccion</p>}

                    {/* Campo Correo */}
                    <input
                        type="email"
                        {...register("correo", { required: true })} // Validamos que el campo 'correo' sea obligatorio
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Correo"
                    />
                    {errors.correo && <p className="text-red-500">Se requiere Correo</p>}

                    {/* Campo Teléfono */}
                    <input
                        type="text"
                        {...register("telefono", { required: true })} // Validamos que el campo 'telefono' sea obligatorio
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Telefono"
                    />
                    {errors.telefono && <p className="text-red-500">Se requiere Telefono</p>}

                    {/* Campo Contraseña */}
                    <input
                        type="password"
                        {...register("contraseña", { required: true })} // Validamos que el campo 'contraseña' sea obligatorio
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Contraseña"
                    />
                    {errors.contraseña && <p className="text-red-500">Se requiere Contraseña</p>}

                    {/* Botón de enviar */}
                    <button type="submit"
                        className='bg-sky-500 text-white px-4 py-2 rounded-md my-2'>
                        Registrar
                    </button>
                </form>

                {/* Enlace para ir al login si ya tienen cuenta */}
                <p className='flex gap-x-2 justify-between'>
                    Ya tienes una cuenta?{" "}
                    <Link to="/login" className='text-sky-500'>Login</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
