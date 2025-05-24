import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

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
    <div className="flex h-screen items-center justify-center">
      <div className="bg-zinc-800 p-10 rounded-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Recuperar Contraseña</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            {...register("email", { required: "El correo es obligatorio" })}
            placeholder="Correo electrónico"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 transition-colors text-white px-4 py-2 rounded-md mt-4"
          >
            Enviar correo de recuperación
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
