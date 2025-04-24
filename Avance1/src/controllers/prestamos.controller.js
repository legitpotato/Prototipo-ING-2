
// Controllers/prestamo.controller.js
import Prestamo from '../models/prestamo.model.js';
import Task from '../models/task.model.js';

// Obtener todos los préstamos
export const getPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.find();
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los préstamos" });
  }
};

// Obtener préstamos de un usuario específico por ID
export const getPrestamosByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const prestamos = await Prestamo.find({ id_user: id });

    if (!prestamos.length) {
      return res.status(404).json({ message: "No se encontraron préstamos para este usuario." });
    }

    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los préstamos" });
  }
};

// Crear un préstamo
export const createPrestamo = async (req, res) => {
  console.log('Solicitud recibida en el backend:', req.body);

  try {
    const { id_user, id_libro, nombre_usuario, nombre_libro, fecha_reserva, fecha_limite, carrito } = req.body;

    const libro = await Task.findById(id_libro);
    if (!libro) {
      return res.status(404).json({ message: "El libro no existe" });
    }

    if (libro.cantidad <= 0) {
      return res.status(400).json({ message: "No hay ejemplares disponibles para este libro" });
    }

    libro.cantidad -= 1;
    await libro.save();

    const nuevoPrestamo = new Prestamo({
      id_user,
      id_libro,
      nombre_usuario,
      nombre_libro,
      fecha_reserva,
      fecha_limite,
      carrito,
    });

    const savedPrestamo = await nuevoPrestamo.save();
    res.status(201).json(savedPrestamo);
  } catch (error) {
    console.error("Error en createPrestamo:", error);
    res.status(500).json({ message: "Error al crear el préstamo", error: error.message });
  }
};

// Crear una reserva
export const crearReserva = async (req, res) => {
  const { id_user, id_libro, nombre_usuario, nombre_libro, fecha_reserva, fecha_limite, carrito } = req.body;

  try {
    const reserva = new Prestamo({
      id_user,
      id_libro,
      nombre_usuario,
      nombre_libro,
      fecha_reserva,
      fecha_limite,
      carrito,
    });

    const nuevaReserva = await reserva.save();

    res.json(nuevaReserva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar la reserva" });
  }
};

// Obtener préstamo por ID
export const getPrestamo = async (req, res) => {
  try {
    const prestamo = await Prestamo.findById(req.params.id).populate('id_user id_libro');
    if (!prestamo) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }
    res.json(prestamo);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el préstamo", error: error.message });
  }
};

// Eliminar préstamo por ID
export const deletePrestamo = async (req, res) => {
  try {
    const prestamo = await Prestamo.findById(req.params.id);

    if (!prestamo) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    const libro = await Task.findById(prestamo.id_libro);
    if (libro) {
      libro.cantidad += 1;
      await libro.save();
    }

    await Prestamo.findByIdAndDelete(req.params.id);

    res.json({ message: "Préstamo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el préstamo", error: error.message });
  }
};

// Actualizar préstamos por ID de usuario
export const updatePrestamosByUserId = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const result = await Prestamo.updateMany(
      { id_user: id },
      { $set: updates },
      { new: true }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No se encontraron préstamos para este usuario." });
    }

    res.json({
      message: "Préstamos actualizados correctamente.",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error al actualizar los préstamos:", error);
    res.status(500).json({ message: "Error al actualizar los préstamos", error: error.message });
  }
};
