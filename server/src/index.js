import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './db/database.js';
import { seedDatabase } from './db/seed.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import collabRoutes from './routes/collabRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Auto-seed if database is completely empty
const existingUsers = db.find('users');
if (existingUsers.length === 0) {
  console.log('Database empty, triggering initial demo seed...');
  seedDatabase().catch(err => console.error('Seed error:', err));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:id/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/collaborations', collabRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Healthcheck & Stats
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'IdeaPeerCircle',
    tagline: 'Build. Share. Learn. Improve.',
    timestamp: new Date().toISOString(),
    stats: {
      users: db.find('users').length,
      projects: db.find('projects').length,
      reviews: db.find('reviews').length,
      aiInsights: db.find('ai_insights').length,
      collaborations: db.find('collaborations').length
    }
  });
});

// Reset / Re-seed endpoint for demo testing
app.post('/api/admin/reset-demo', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database refreshed with pristine demo student projects.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset demo: ' + err.message });
  }
});

// Serve frontend static build in production if present
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDist, 'index.html'), err => {
    if (err) next();
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'An internal server error occurred.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  IdeaPeerCircle Backend API Server Running!  `);
  console.log(`  Port: http://localhost:${PORT}             `);
  console.log(`  Health: http://localhost:${PORT}/api/health `);
  console.log(`===============================================`);
});

export default app;
