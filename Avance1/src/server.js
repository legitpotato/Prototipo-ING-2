import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Prestamo from './models/Prestamo.js';
import Task from './models/task.model.js'; 
import Usuario from './models/user.model.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Ruta para obtener todas las tareas --------------------------------------------------------------------
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find(); 
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No hay tareas disponibles' });
    }
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas', error: error.message }); // Enviar mensaje de error detallado
  }
});

// Ruta para obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();  
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

// Ruta para actualizar el rol de administrador--------------------------------------------------------------------------
app.patch('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;

  // Validar que el campo 'admin' sea un valor booleano
  if (typeof admin !== 'boolean') {
    return res.status(400).json({ error: 'El campo "admin" debe ser un valor booleano (true o false)' });
  }

  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { admin },  // Se pasa el valor booleano 'admin'
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});


// Ruta para eliminar un usuario
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
});
//prestamso----------------------------------------------------------------------------------------------------------------
app.get('/prestamo', async (req, res) => {
  try {
    const prestamos = await Prestamo.find();
    res.json(prestamos);
  } catch (err) {
    console.error('Error en la ruta /prestamo:', err);
    res.status(500).json({ message: 'Error al obtener los préstamos' });
  }
});



// Ruta para agregar un nuevo préstamo
app.post('/prestamo', async (req, res) => {
  const { nombre_usuario, nombre_libro, fecha_reserva, fecha_limite, retraso, multa } = req.body;

  // Convertir el valor de retraso a un booleano si es necesario
  const retrasoBooleano = retraso === 'Sí';  // Si retraso es 'Sí', se convierte en true

  const nuevoPrestamo = new Prestamo({
    nombre_usuario,
    nombre_libro,
    fecha_reserva,
    fecha_limite,
    retraso: retrasoBooleano, // Usar el valor booleano
    multa
  });

  try {
    const prestamoGuardado = await nuevoPrestamo.save();
    res.status(201).json(prestamoGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Conexión a Mondongo 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((error) => console.error('Error de conexión a MongoDB', error));

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));