import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/usersRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', usersRoutes);
app.use('/api', profileRoutes);

export default app;
