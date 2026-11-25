
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const interestRoutes = require('./routes/interestRoutes');
const projectRoutes = require('./routes/projectRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const proofRoutes = require('./routes/proofRoutes');
const aiRoutes = require('./routes/aiRoutes');
const teamIntelligenceRoutes = require('./routes/teamIntelligenceRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Trust Render's reverse proxy
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.nodeEnv === 'development' ? 10000 : 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.nodeEnv === 'development' ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts. Please try again later.'
  }
});

// Apply general rate limiting to API routes
app.use('/api', generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Authentication routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);

// Other routes
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/proofs', proofRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/team-intelligence', teamIntelligenceRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/notifications', notificationRoutes);

// Global error handler
app.use(errorMiddleware);

module.exports = app;
