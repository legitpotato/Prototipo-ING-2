import express from 'express';
import cors from 'cors';
import pagoRoutes from './src/routes/pagoRoutes.js';

const app = express();

app.use(cors()); // Esto habilita CORS para todas las rutas y orígenes
app.use(express.json());
app.use('/pagos', pagoRoutes);

app.listen(4000, () => {
  console.log('Server on port 4000');
});
