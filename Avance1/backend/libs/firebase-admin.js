import admin from 'firebase-admin';
import serviceAccount from './comunired-96f92-firebase-adminsdk-fbsvc-b94f571f5e.json' assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
