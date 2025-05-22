import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const serviceAccount = require('./comunired-96f92-firebase-adminsdk-fbsvc-b94f571f5e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;