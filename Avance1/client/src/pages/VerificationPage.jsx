import { useForm } from 'react-hook-form'; // Importamos el hook useForm de 'react-hook-form' para gestionar formularios
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para redirigir al usuario a otra página

function VerificationPage() {
    // Inicializamos el hook useForm para gestionar el estado del formulario y los errores
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate(); // Usamos el hook useNavigate para poder redirigir al usuario

    // Función que maneja el envío del formulario
    const onSubmit = handleSubmit((data) => {
        // Aquí realizamos la validación del código
        if (data.codigo === '123456') { // Verificamos si el código ingresado es el correcto
            navigate('/tasks'); // Si el código es válido, redirigimos al usuario a la página de tareas
        } else {
            alert('Código inválido'); // Si el código no es válido, mostramos una alerta
        }
    });

    return (
        <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
            <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
                <h1 className='text-3xl font-bold my-2'>Verificación de Correo</h1>
                <form onSubmit={onSubmit}>
                    {/* Campo para ingresar el código de verificación */}
                    <input
                        type="text"
                        {...register("codigo", { required: true })} // Usamos el hook register para gestionar el estado del input
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Código de Verificación"
                    />
                    {/* Si hay un error en el campo código, mostramos un mensaje de error */}
                    {errors.codigo && <p className="text-red-500">Se requiere el código</p>}
                    <button
                        type="submit"
                        className='bg-sky-500 text-white px-4 py-2 rounded-md my-2'>
                        Verificar {/* Botón para enviar el formulario */}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerificationPage; // Exportamos el componente para poder usarlo en otros lugares
