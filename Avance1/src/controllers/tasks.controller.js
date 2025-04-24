import Task from '../models/task.model.js'

// Obtener todas las documentos de la base de datos
export const getTasks = async (req, res) => {
    try {
        // Recuperar todas las documentos almacenadas en la base de datos
        const tasks = await Task.find(); 
        // Responder con todas las documentos en formato JSON
        res.json(tasks); 
    } catch (error) {
        // Si ocurre un error, devolver un mensaje de error con el código 500
        res.status(500).json({ message: "Error al obtener los documentos" });
    }
};

// Crear un nuevo documento en la base de datos
export const createTask = async (req, res) => {
   try {
        // Extraer los datos necesarios del cuerpo de la solicitud
        const {title, autor, tipodoc, categoria, editorial, edicion, anoedicion, ubicacion, cantidad, reserva_hist, resumen, imgURL, date} = req.body;

        // Crear un nuevo objeto de documento con los datos proporcionados
        const newTask = new Task({
            title,
            autor,
            tipodoc,
            categoria,
            editorial,
            edicion,
            anoedicion,
            ubicacion,
            cantidad,
            reserva_hist,
            resumen,
            imgURL,
            date,
            // Asignar el usuario que está creando el documento (proporcionado por el middleware de autenticación)
            user: req.user.id
        });

        // Guardar el documento en la base de datos
        const savedTask = await newTask.save();
        // Devolver el documento recién guardada en formato JSON
        res.json(savedTask);
   } catch (error) {
        console.log(error)
        // Si hay un error, devolver un mensaje de error con código 500
        return res.status(500).json({ message: "Algo malo pasó"});
   }
};

// Obtener un documento específico por su ID
export const getTask = async (req, res) => {
    try {
        // Buscar el documento por su ID, y obtener los datos del usuario asociado a el documento
        const task = await Task.findById(req.params.id).populate('user');
        // Si el documento no se encuentra, devolver un error 404
        if(!task) return res.status(404).json({ message: 'Documento no encontrado'});
        // Devolver el documento encontrada en formato JSON
        res.json(task);
    } catch (error) {
        // Si ocurre un error, devolver un mensaje de error 404
        return res.status(404).json({ message: "Documento no encontrado"});
    }
};

// Eliminar un documento por su ID
export const deleteTask = async (req, res) => {
    try {
        // Buscar el documento por su ID y eliminarla
        const task = await Task.findByIdAndDelete(req.params.id);
        // Si el documento no se encuentra, devolver un error 404
        if(!task) return res.status(404).json({ message: 'Documento no encontrado' });
        // Responder con estado 204 (sin contenido) indicando que el documento fue eliminada
        return res.sendStatus(204)
    } catch (error) {
        // Si hay un error, devolver un mensaje de error 404
        return res.status(404).json({ message: "Documento no encontrado"});
    }
};

// Actualizar un documento existente por su ID
export const updateTask = async (req, res) => {
    try {
        // Buscar el documento por su ID y actualizarla con los datos enviados en el cuerpo de la solicitud
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Retornar el documento actualizado
        });
        // Si no se encuentra el documento, devolver un error 404
        if(!task) return res.status(404).json({ message: 'Documento no encontrado' });
        // Devolver el documento actualizada
        res.json(task);
    } catch (error) {
        // Si ocurre un error, devolver un mensaje de error 404
        return res.status(404).json({ message: "Documento no encontrado"});
    }
};

// Obtener un documento específico por su código (cod)
export const getTaskByCod = async (req, res) => {
    try {
      // Buscar un documento por su código (cod) proporcionado en los parámetros de la URL
      const task = await Task.findOne({ cod: req.params.cod });
      // Si no se encuentra el documento, devolver un error 404
      if (!task) {
        return res.status(404).json({ message: 'Documento no encontrado' });
      }
      // Devolver el documento encontrada en formato JSON
      return res.json(task);
    } catch (error) {
      console.error('Error en getTaskByCod:', error);
      // Si hay un error, devolver un mensaje de error 500
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

// Obtener documentos filtrados por categoría
export const getTasksByCategoria = async (req, res) => {
    const { categoria } = req.params; // Captura la categoría desde los parámetros de la URL
    try {
        // Busca todos los documentos que coincidan con la categoría
        const tasks = await Task.find({ categoria: categoria });

        // Si no se encuentran documentos, se devuelve un 404
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No se encontraron documentos en esta categoría' });
        }

        // Devolver los documentos filtrados
        res.json(tasks);
    } catch (error) {
        // En caso de error, devolver un mensaje de error 500
        res.status(500).json({ message: error.message });
    }
};

// Obtener documentos filtrados por autor
export const getTasksByAutor = async (req, res) => {
    const { autor } = req.params; // Captura el autor desde los parámetros de la URL
    try {
        // Busca todos los documentos que coincidan con el autor
        const tasks = await Task.find({ autor: autor });

        // Si no se encuentran documentos, se devuelve un 404
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No se encontraron documentos con este autor' });
        }

        // Devolver los documentos filtrados
        res.json(tasks);
    } catch (error) {
        // En caso de error, devolver un mensaje de error 500
        res.status(500).json({ message: error.message });
    }
};

// Obtener documentos filtrados por título
export const getTasksByTitle = async (req, res) => {
    const { title } = req.params; // Captura el título desde los parámetros de la URL
    try {
        // Busca todos los documentos que coincidan con el título
        const tasks = await Task.find({ title: title });

        // Si no se encuentran documentos, se devuelve un 404
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No se encontraron documentos con este título' });
        }

        // Devolver los documentos filtrados
        res.json(tasks);
    } catch (error) {
        // En caso de error, devolver un mensaje de error 500
        res.status(500).json({ message: error.message });
    }
};
