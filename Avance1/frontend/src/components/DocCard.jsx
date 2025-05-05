// Componente funcional DocCard que recibe como prop un objeto llamado 'task'.
function DocCard({ task }) {
  return (
    <div 
      className="bg-zinc-800 p-5 rounded-lg text-center shadow-lg max-w-xs mx-auto h-[550px] 
                 font-mono transition-transform duration-300 hover:scale-105"
    >
      {/* Muestra la imagen del documento utilizando la URL proporcionada en 'task.imgURL'. 
          La imagen ocupa todo el ancho disponible y tiene una altura fija de 80 unidades. */}
      <img
        src={task.imgURL}
        alt={task.title} // El texto alternativo usa el título de la tarea.
        className="w-full h-80 object-cover rounded-md"
      />
      
      {/* Muestra el título del documento en un encabezado de nivel 3 con estilos adicionales. */}
      <h3 className="text-white text-xl font-bold mt-4">{task.title}</h3>
      
      {/* Muestra el autor del documento con un estilo de texto más claro. */}
      <p className="text-slate-300">{task.autor}</p>

      {/* Muestra la edición del documento. */}
      <p className="text-slate-300">{task.edicion}</p>

      {/* Muestra la categoría del documento. */}
      <p className="text-slate-300">{task.categoria}</p>
    </div>
  );
}

export default DocCard;
