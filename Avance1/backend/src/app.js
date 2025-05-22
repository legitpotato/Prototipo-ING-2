import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/usersRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', usersRoutes);
app.use('/', pagoRoutes);

export default app;
