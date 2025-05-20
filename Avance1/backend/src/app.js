import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/usersRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', usersRoutes);

export default app;
