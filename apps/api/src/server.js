import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import bookingsRouter from './routes/bookings.js';

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/bookings', bookingsRouter);

app.use((error, _req, res, _next) => {
  console.error('[api] Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
