import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';

const app = express();
const PORT = Number(process.env.PORT || 5000);
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'JobTrack API' }));
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err?.code === 11000) return res.status(409).json({ message: 'That email address is already registered.' });
  if (err?.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors)[0]?.message || 'Invalid input.' });
  res.status(500).json({ message: 'Something went wrong on the server. Check the backend terminal.' });
});

try {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('replace_this')) throw new Error('Set a private JWT_SECRET in server/.env before starting JobTrack.');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobtrack', { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected: jobtrack');
  app.listen(PORT, () => console.log(`JobTrack API running at http://localhost:${PORT}`));
} catch (err) {
  console.error('\nJobTrack could not start.');
  console.error(err.message);
  if (err.name === 'MongooseServerSelectionError') console.error('Make sure MongoDB Community Server is installed and its service is running.');
  process.exit(1);
}
