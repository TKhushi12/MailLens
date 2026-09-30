import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import emailRoutes from './routes/emailRoutes.js';
import replyRoutes from './routes/replyRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { seedSampleEmails } from './services/seedService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'MailLens Backend',
    version: '1.0.0',
  });
});

// Routes
app.use('/api/emails', emailRoutes);
app.use('/api/replies', replyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start listening immediately
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 MailLens Backend running on http://localhost:${PORT}`);
  console.log(`📡 Ready for React Frontend at http://localhost:5173`);
  console.log(`====================================================`);
});

// Connect DB and seed asynchronously
(async () => {
  try {
    await connectDB();
    await seedSampleEmails(false);
    console.log('[Startup] MailLens Database ready & initial data loaded.');
  } catch (err) {
    console.error('[Startup Error]:', err);
  }
})();
