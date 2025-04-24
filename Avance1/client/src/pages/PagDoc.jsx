import { useEffect, useState } from 'react';
import { useTasks } from '../context/TasksContext';
import { getTaskByCodRequest } from '../api/tasks';
import { Link } from 'react-router-dom';

function PagDoc() {
    // Hooks de estado para manejar los datos y mensajes de la aplicación
    const { getTasks, deleteTask } = useTasks(); // Funciones del contexto para obtener y eliminar tareas
    const [inputCod, setInputCod] = useState(''); // Estado para almacenar el código ingresado por el usuario
    const [document, setDocument] = useState(''); // Estado para almacenar el documento encontrado
    const [error, setError] = useState(''); // Estado para almacenar los mensajes de error
    const [successMessage, setSuccessMessage] = useState(''); // Estado para mensajes de éxito

    // Llama a la función getTasks al montar el componente para cargar los documentos disponibles
    useEffect(() => {
        getTasks(); // Llama a la función getTasks para obtener las tareas al inicio
    }, []);

    // Maneja la búsqueda del documento al hacer clic en "Buscar"
    const handleSearch = async () => {
        if (!inputCod.trim()) { // Valida si el campo de código está vacío
            setError('Ingrese un código.'); // Muestra un mensaje de error si está vacío
            setDocument(null); // Limpia cualquier documento previo
            setSuccessMessage(''); // Limpia los mensajes de éxito
            return;
        }

        try {
            // Realiza la llamada a la API para obtener el documento por código
            const response = await getTaskByCodRequest(inputCod);

            // Si la respuesta contiene datos, guarda el documento
            if (response.data) {
                setDocument(response.data); // Asigna el documento encontrado al estado 'document'
                setError(''); // Limpia cualquier error previo
                setSuccessMessage('Documento encontrado!'); // Muestra mensaje de éxito
            } else {
                setDocument(null); // Si no se encuentra el documento, limpia el estado 'document'
                setError('Documento no encontrado.'); // Muestra mensaje de error
                setSuccessMessage(''); // Limpia los mensajes de éxito
            }
        } catch (error) {
            // En caso de error en la llamada a la API
            setError('Ocurrió un error al buscar el documento.'); // Muestra mensaje de error
            setDocument(null); // Limpia el documento en caso de error
            setSuccessMessage(''); // Limpia los mensajes de éxito
        }
    };

    // Maneja la eliminación de un documento
    const handleDelete = async () => {
        if (!document) {
            setError('Primero busque el documento antes de intentar eliminar.'); // Muestra mensaje si no se ha buscado el documento
            return;
        }
        try {
            // Realiza la llamada a la API para eliminar el documento por su ID
            await deleteTask(document._id);
            setSuccessMessage('Documento eliminado exitosamente.'); // Muestra mensaje de éxito
            setDocument(null); // Limpia el documento después de la eliminación
        } catch (error) {
            setError('Ocurrió un error al intentar eliminar el documento.'); // Muestra mensaje de error si ocurre un problema
        }
    };

    // Maneja los cambios en el campo de entrada del código
    const handleInputChange = (e) => {
        setInputCod(e.target.value); // Actualiza el estado del código ingresado
        setError(''); // Limpia el mensaje de error
        setDocument(null); // Limpia cualquier documento previamente encontrado
        setSuccessMessage(''); // Limpia los mensajes de éxito
    };

    return (
        <div className="mt-14">
            <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
                <header className="flex flex-col gap-4">
                    {/* Campo de entrada para el código del documento */}
                    <label htmlFor="cod" className="text-white text-lg font-semibold font-serif">Ingrese el código del documento:</label>
                    <input
                        type="text"
                        id="cod"
                        value={inputCod}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                        autoFocus // Hace que el campo se enfoque automáticamente al cargar
                    />
                    {/* Botón de búsqueda */}
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md gap-x-2 mt-2"
                        onClick={handleSearch} // Llama a la función de búsqueda
                    >
                        Buscar
                    </button>

                    {/* Mensajes de error y éxito */}
                    {error && <p className="text-red-500">{error}</p>} {/* Muestra el error si existe */}
                    {successMessage && <p className="text-green-500">{successMessage}</p>} {/* Muestra el mensaje de éxito si existe */}
                    
                    {/* Muestra el documento encontrado y las opciones para eliminar o editar */}
                    {document && (
                        <div className="bg-gray-700 p-4 rounded-md text-white">
                            <h2>Documento encontrado:</h2>
                            <p>Código: {document.cod}</p> {/* Muestra el código del documento */}
                            <p>Título: {document.title || 'Sin título'}</p> {/* Muestra el título o un mensaje si no tiene */}
                            <div className="flex gap-x-2 mt-4">                                
                                {/* Enlace para editar el documento */}
                                <Link
                                    to={`/tasks/${document._id}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Editar
                                </Link>
                            </div>
                        </div>
                    )}
                </header>
            </div>
        </div>
    );
}

export default PagDoc;
