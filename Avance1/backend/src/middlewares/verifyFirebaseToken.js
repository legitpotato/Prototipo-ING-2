import admin from '../../libs/firebase-admin.js';

const verifyFirebaseToken = async (req, res, next) => {
  console.log('Middleware verifyFirebaseToken ejecutado');
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No hay header Authorization');
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Token mal formado');
    return res.status(401).json({ message: 'Token mal formado' });
  }

  console.log('Token recibido:', token);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verificado correctamente:', decodedToken);
    req.uid = decodedToken.uid;
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export { verifyFirebaseToken };
