import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FloatingInput } from '../components/TextoFlotante.jsx'

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
    <div className='flex min-h-screen items-center justify-center py-11'>
        <div className="mt-8 p-10 border border-gray-300 rounded-lg max-w-md w-full bg-white shadow-md"> 
                {registerErrors.map((error, i) => (
                    <div className='bg-red-500 p-2 text-white' key={i}>
                        {error}
                    </div>
                ))}
                <h1 className='text-3xl text-indigo-500 font-bold text-center mb-10 mt-2'>Regístrate en ComuniRed</h1>

               <form onSubmit={onSubmit} className='space-y-8'>
                <FloatingInput
                name="rut"
                type="text"
                label="RUT (sin puntos ni guión)"
                register={register}
                error={errors.rut}
                validation={{
                    required: "Se requiere RUT",
                    pattern: {
                    value: /^[0-9]{1,8}[kK]?$/,
                    message: "RUT inválido. Solo números y una K/k al final, sin puntos ni guiones."
                    }
                }}
                />

                <FloatingInput
                    name="nombre"
                    type="text"
                    label="Nombre"
                    register={register}
                    error={errors.nombre}
                    validation={{ required: "Se requiere Nombre" }}
                />

                <FloatingInput
                    name="apellido"
                    type="text"
                    label="Apellido"
                    register={register}
                    error={errors.apellido}
                    validation={{ required: "Se requiere Apellido" }}
                />

                <FloatingInput
                    name="fechaNacimiento"
                    type="text"
                    label="Fecha de Nacimiento (DD/MM/YYYY)"
                    register={register}
                    error={errors.fechaNacimiento}
                    validation={{
                    required: "Se requiere Fecha de Nacimiento",
                    pattern: {
                        value: /^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[0-2])[\/]\d{4}$/,
                        message: "Formato de fecha debe ser DD/MM/YYYY"
                    }
                    }}
                />

                <FloatingInput
                    name="email"
                    type="email"
                    label="Correo Electrónico"
                    register={register}
                    error={errors.email}
                    validation={{ required: "Se requiere Correo Electrónico" }}
                />

                <FloatingInput
                    name="password"
                    type="password"
                    label="Contraseña"
                    register={register}
                    error={errors.password}
                    validation={{
                    required: "Se requiere Contraseña",
                    pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número."
                    }
                    }}
                />

                <button
                    type="submit"
                    className='bg-indigo-500 hover:bg-indigo-600 transition-colors text-white px-6 py-2 rounded-md mx-auto block'>
                    Registrar
                </button>
                </form>


                <p className='mt-4 text-sm text-center text-black'>
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className='text-sky-500'>Iniciar sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
