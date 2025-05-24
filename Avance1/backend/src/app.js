import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/usersRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';
import morosidadRoutes from './routes/morosidadRoutes.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', usersRoutes);
app.use('/api', profileRoutes);
app.use('/api', pagoRoutes);
app.use('/api', morosidadRoutes);


export default app;
