import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro'; // Reemplaza esto en .env
const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { firstName, lastName, rut, birthDate, email, password } = req.body;

    // Validaciones básicas
    if (!firstName || !lastName || !rut || !birthDate || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Validar formato del RUT
    const rutRegex = /^[0-9]+[kK]?$/;
    if (!rutRegex.test(rut)) {
      return res.status(400).json({ message: 'Formato de RUT inválido. Usa solo números y una K/k al final si corresponde.' });
    }

    // Verificar si el email o rut ya existen
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { rut }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico o RUT ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        rut,
        birthDate: new Date(birthDate), // Convertimos fecha a Date
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: { id: user.id, email: user.email } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};