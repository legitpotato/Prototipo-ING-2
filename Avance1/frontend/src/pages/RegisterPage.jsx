import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated]);

    const onSubmit = handleSubmit(async (values) => {
        // Mapear los nombres a lo que Firebase espera
        const firebasePayload = {
            email: values.email,
            password: values.password,
        };

        // Datos adicionales para guardar en PostgreSQL vía API backend
        const additionalData = {
            rut: values.rut,
            firstName: values.nombre,
            lastName: values.apellido,
            birthDate: values.fechaNacimiento,
            };


        await signup(firebasePayload, additionalData);
    });

    return (
        <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
            <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
                {registerErrors.map((error, i) => (
                    <div className='bg-red-500 p-2 text-white' key={i}>
                        {error}
                    </div>
                ))}
                <h1 className='text-3xl font-bold my-2'>Regístrate en ComuniRed</h1>

                <form onSubmit={onSubmit}>

                    <input
                        type="text"
                        {...register("rut", {
                            required: "Se requiere RUT",
                            pattern: {
                                value: /^[0-9kK]+$/,
                                message: "El RUT debe contener solo números o la letra K, sin puntos ni guiones."
                            }
                        })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="RUT (sin puntos ni guión)"
                    />
                    {errors.rut && <p className="text-red-500">{errors.rut.message}</p>}

                    <input
                        type="text"
                        {...register("nombre", { required: "Se requiere Nombre" })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Nombre"
                    />
                    {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}

                    <input
                        type="text"
                        {...register("apellido", { required: "Se requiere Apellido" })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Apellido"
                    />
                    {errors.apellido && <p className="text-red-500">{errors.apellido.message}</p>}

                    <input
                        type="text"
                        {...register("fechaNacimiento", {
                            required: "Se requiere Fecha de Nacimiento",
                            pattern: {
                                value: /^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[0-2])[\/]\d{4}$/,
                                message: "Formato de fecha debe ser DD/MM/YYYY"
                            }
                        })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Fecha de Nacimiento (DD/MM/YYYY)"
                    />
                    {errors.fechaNacimiento && <p className="text-red-500">{errors.fechaNacimiento.message}</p>}

                    <input
                        type="email"
                        {...register("email", { required: "Se requiere Correo Electrónico" })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Correo Electrónico"
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                    <input
                        type="password"
                        {...register("password", {
                            required: "Se requiere Contraseña",
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                message: "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número."
                            }
                        })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Contraseña"
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                    <button
                        type="submit"
                        className='bg-sky-500 text-white px-4 py-2 rounded-md my-2'>
                        Registrar
                    </button>
                </form>

                <p className='flex gap-x-2 justify-between'>
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className='text-sky-500'>Iniciar sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
