import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FloatingInput } from '../components/TextoFlotante.jsx';
import DatePickerInput from '../components/DatePickerInput.jsx';


function RegisterPage() {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    const firebasePayload = {
      email: values.email,
      password: values.password,
    };

    const additionalData = {
      rut: values.rut,
      firstName: values.nombre,
      lastName: values.apellido,
      birthDate: values.fechaNacimiento,
    };

    await signup(firebasePayload, additionalData);
  });

  return (
    <div className="flex min-h-screen items-center justify-center py-11">
      <div className="mt-8 p-10 border border-gray-300 rounded-lg max-w-md w-full bg-white shadow-md">
        {registerErrors.map((error, i) => (
          <div className="bg-red-100 text-red-700 p-2 text-center my-2 rounded" key={i}>
            {error}
          </div>
        ))}

        <h1 className="text-3xl text-indigo-500 font-bold text-center mb-10 mt-2">
          Regístrate en ComuniRed
        </h1>

        <form onSubmit={onSubmit} className="space-y-8">
            <FloatingInput
            name="rut"
            type="text"
            label="RUT (sin puntos ni guión)"
            register={register}
            error={errors.rut}
            validation={{
                required: "Se requiere RUT",
                validate: (value) =>
                validarRutCompleto(value) || "RUT inválido. Verifica el dígito verificador.",
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


          <DatePickerInput
            control={control}
            name="fechaNacimiento"
            label="Fecha de Nacimiento"
            register={register}
            error={errors.fechaNacimiento}
            validation={{
              required: "Se requiere Fecha de Nacimiento",
              pattern: {
                value: /^(0[1-9]|[12][0-9]|3[01])\/[\/]\d{4}$/,
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
            validation={{
              required: "Se requiere Correo Electrónico",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo inválido. Debe tener un formato como usuario@dominio.com"
              }
            }}
          />

          <FloatingInput
            name="password"
            type="password"
            label="Contraseña"
            register={register}
            error={errors.password}
            validation={{
              required: "Se requiere Contraseña",
              minLength: {
                value: 8,
                message: "Debe tener al menos 8 caracteres"
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: "Debe incluir una mayúscula y un número"
              }
            }}
          />

          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white px-6 py-2 rounded-md mx-auto block"
          >
            Registrar
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-black">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-sky-500 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

function validarRutCompleto(rut) {
  rut = rut.replace(/\./g, '').replace('-', '').toUpperCase();

  if (!/^[0-9]+[0-9K]$/.test(rut)) return false;

  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvCalculado =
    dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvCalculado;
}


export default RegisterPage;
