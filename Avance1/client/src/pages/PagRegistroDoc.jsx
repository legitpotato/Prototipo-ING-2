import { useForm } from "react-hook-form"; // Importa el hook 'useForm' de react-hook-form para manejar formularios
import { useTasks } from "../context/TasksContext"; // Importa el contexto de las tareas para interactuar con la base de datos o estado global
import { useNavigate, useParams } from 'react-router-dom'; // Importa 'useNavigate' y 'useParams' para navegar entre páginas y obtener parámetros de la URL
import { useEffect, useState } from "react"; // Importa 'useEffect' y 'useState' de React para manejar efectos secundarios y estado local

import dayjs from 'dayjs'; // Importa 'dayjs' para manipular fechas de manera sencilla
import utc from 'dayjs/plugin/utc'; // Importa el plugin 'utc' de dayjs para manejar fechas en formato UTC
dayjs.extend(utc); // Extiende dayjs con el plugin 'utc'

function PagRegistroDoc() {
    // Configura el formulario usando 'useForm' con validaciones y control del estado de los errores
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { createTask, getTask, updateTask } = useTasks(); // Obtiene las funciones de manejo de tareas desde el contexto
    const navigate = useNavigate(); // Función para navegar entre rutas
    const params = useParams(); // Obtiene los parámetros de la URL (como el 'id' de la tarea si es necesario)
    const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito después de guardar o actualizar

    // Usamos 'useEffect' para cargar los datos de la tarea si existe un 'id' en los parámetros de la URL
    useEffect(() => {
        async function loadTask() {
            if (params.id) { // Si existe un 'id', se carga la tarea para editar
                const task = await getTask(params.id); // Obtiene los detalles de la tarea con el 'id'
                // Se establece cada valor del formulario con los datos de la tarea obtenida
                setValue('title', task.title);
                setValue('autor', task.autor);
                setValue('tipodoc', task.tipodoc);
                setValue('categoria', task.categoria);
                setValue('editorial', task.editorial);
                setValue('edicion', task.edicion);
                setValue('anoedicion', task.anoedicion);
                setValue('ubicacion', task.ubicacion);
                setValue('cantidad', task.cantidad);
                setValue('reserva_hist', task.reserva_hist);
                setValue('resumen', task.resumen);
                setValue('imgURL', task.imgURL);
                setValue('date', dayjs.utc(task.date).format('YYYY-MM-DD')); // Formatea la fecha en formato UTC
            }
        }
        loadTask(); // Ejecuta la función para cargar la tarea si existe
    }, []); // Este efecto solo se ejecuta una vez al montar el componente

    // Función que se ejecuta cuando el formulario es enviado
    const onSubmit = handleSubmit(async (data) => {
        // Formatea la fecha a formato UTC antes de enviarlo
        const dataValid = {
            ...data,
            date: data.date ? dayjs.utc(data.date).format() : dayjs.utc().format(),
        };

        // Si hay un 'id' en los parámetros, se actualiza la tarea existente
        if (params.id) {
            await updateTask(params.id, dataValid);
            setSuccessMessage('Documento actualizado exitosamente.'); // Muestra mensaje de éxito
        } else {
            try {
                console.log(dataValid); // Imprime los datos del formulario en la consola (para depuración)
                await createTask(dataValid); // Crea una nueva tarea
                setSuccessMessage('Documento creado exitosamente.'); // Muestra mensaje de éxito
            } catch (error){
                console.log(error); // Si hay error, lo imprime en la consola
            }
        }

        // Después de un breve tiempo (1.5 segundos), navega a la lista de tareas
        setTimeout(() => {
            navigate('/');
        }, 1500);
    });

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex items-center justify-center min-h-screen">
            <div className="bg-zinc-800 w-full max-w-lg p-16 rounded-xl opacity-95 shadow-md m-6">
                <h1 className="text-3xl font-bold text-white text-center mb-6">Registro de Documentos</h1>
                    <form onSubmit={onSubmit}>
                        
                        {/* Campo Título */}
                        <label htmlFor="title">Título</label>
                        <input
                            type="text"
                            {...register("title", { required: "El título es obligatorio." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                            autoFocus
                        />
                        {errors.title && <p className="text-red-500">{errors.title.message}</p>} {/* Muestra error si el campo 'title' es inválido */}

                        {/* Campos de Autor */}
                        {/* Se repite la misma estructura para cada campo de formulario, con su respectiva validación y mensajes de error */}
                        <label htmlFor="autor">Autor</label>
                        <input
                            type="text"
                            {...register("autor", { required: "El autor es obligatorio." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />
                        {errors.autor && <p className="text-red-500">{errors.autor.message}</p>} {/* Mensaje de error */}

                        {/* Campo Tipo de Documento */}
                        <label htmlFor="tipodoc">Tipo de Documento</label>
                        <input
                            type="text"
                            {...register("tipodoc", { required: "El tipo de documento es obligatorio." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />
                        {errors.tipodoc && <p className="text-red-500">{errors.tipodoc.message}</p>}

                        {/* Campo Categoría */}
                        <label htmlFor="categoria">Categoría</label>
                        <input
                            type="text"
                            {...register("categoria", { required: "La categoría es obligatoria." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />
                        {errors.categoria && <p className="text-red-500">{errors.categoria.message}</p>}

                        {/* Campo Editorial */}
                        <label htmlFor="editorial">Editorial</label>
                        <input
                            type="text"
                            {...register("editorial", { required: "La editorial es obligatoria." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />
                        {errors.editorial && <p className="text-red-500">{errors.editorial.message}</p>}

                        {/* Campo Edición */}
                        <label htmlFor="edicion">Edición</label>
                        <input
                            type="text"
                            {...register("edicion", { required: "La edición es obligatoria." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />
                        {errors.edicion && <p className="text-red-500">{errors.edicion.message}</p>}

                        {/* Campo Año de Edición */}
                        <label htmlFor="anoedicion">Año de Edición</label>
                        <input
                            type="text"
                            {...register("anoedicion", { required: "El año de edición es obligatorio." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />
                        {errors.anoedicion && <p className="text-red-500">{errors.anoedicion.message}</p>}

                        {/* Campo Ubicación */}
                        <label htmlFor="ubicacion">Ubicación Estantería</label>
                        <input
                            type="text"
                            {...register("ubicacion", { required: "La ubicación es obligatoria." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />
                        {errors.ubicacion && <p className="text-red-500">{errors.ubicacion.message}</p>}

                        {/* Campo Cantidad */}
                        <label htmlFor="cantidad">Cantidad</label>
                        <input
                            type="number"
                            {...register("cantidad", { required: "La cantidad es obligatoria." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />
                        {errors.cantidad && <p className="text-red-500">{errors.cantidad.message}</p>}

                        {/* Campo Reserva Historica */}
                        <label htmlFor="reserva_hist">Reserva Historica</label>
                        <input
                            type="number"
                            {...register("reserva_hist", { required: "La Reserva Historica es obligatoria." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />
                        {errors.reserva_hist && <p className="text-red-500">{errors.reserva_hist.message}</p>}
                        {/* Campo Resumen */}
                        <label htmlFor="resumen">Resumen</label>
                        <input
                            type="text"
                            {...register("resumen", { required: "El resumen es obligatorio." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />
                        {errors.resumen && <p className="text-red-500">{errors.resumen.message}</p>}

                        {/* Campo Imagen */}
                         <label htmlFor="imgURL">Subir Imagen</label>
                        <input
                            type="text"
                            {...register("imgURL", { required: "La imagen es obligatoria." })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />
                        {errors.imgURL && <p className="text-red-500">{errors.imgURL.message}</p>}

                        {/* Campo Fecha */}
                        <label htmlFor="date">Fecha</label>
                        <input
                            type="date"
                            {...register('date')} /* Se registra el campo de fecha */
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        />

                        {/* Botones Guardar y Volver */}
                        <div className="flex justify-center gap-x-4 mt-4">
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold transition duration-200"
                            >
                                Guardar
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => navigate("/")} /* Navega hacia la lista de tareas */
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold transition duration-200"
                            >
                                Volver
                            </button>
                        </div>
                    </form>

                    {/* Mostrar mensaje de éxito */}
                    {successMessage && (
                        <p className="text-green-500 text-center my-4">{successMessage}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PagRegistroDoc;
