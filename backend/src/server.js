import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/auth', authRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route non trouvée.' });
});

app.listen(port, () => {
  console.log(`Evenflow API running on http://localhost:${port}`);
});
