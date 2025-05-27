import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { FloatingInput } from '../components/TextoFlotante.jsx';

function ResetPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { resetPassword } = useAuth();

  const onSubmit = async ({ email }) => {
    try {
      await resetPassword(email);
      alert("Se ha enviado un correo para restablecer tu contraseña.");
    } catch (error) {
      alert("Hubo un error al intentar enviar el correo.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md border border-gray-300 rounded-lg max-w-md w-full p-10">
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="\src\assets\logoComuniRed.png"
            alt="Logo comunidad"
            className="w-20 h-20 mb-2"
          />
          <h2 className="text-2xl font-bold text-zinc-600">¿Olvidaste tu contraseña?</h2>
        </div>

        <h1 className="text-2xl text-indigo-500 font-bold text-center mb-8">
          Recuperar Contraseña
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FloatingInput
            label="Correo electrónico"
            type="email"
            name="email"
            register={register}
            error={errors.email}
            validation={{ required: "El correo es obligatorio" }}
          />

        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white px-6 py-2 rounded-md mx-auto block"
        >
          Enviar correo
        </button>

        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
