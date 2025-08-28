import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import notesRoutes from './routes/notes.routes';
import env from './config/env';

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.get('/', (req, res) => res.send({ ok: true }));
export default app;
