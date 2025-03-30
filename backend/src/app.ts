import express from 'express';
import cors from 'cors';
import dutyRoutes from './routes/duty.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', dutyRoutes);

export default app;
