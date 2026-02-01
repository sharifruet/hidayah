import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Import routes
import prayerTimesRoutes from './routes/prayerTimes.js';
import fastingTimesRoutes from './routes/fastingTimes.js';
import sunTimesRoutes from './routes/sunTimes.js';
import calendarRoutes from './routes/calendar.js';
import batchRoutes from './routes/batch.js';
import locationsRoutes from './routes/locations.js';
import methodsRoutes from './routes/methods.js';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { securityMiddleware } from './middleware/security.js';
import { checkDatabaseHealth } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Request ID middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Request logging middleware
app.use(requestLogger);

// Security middleware
if (process.env.NODE_ENV === 'production') {
  app.use(securityMiddleware());
} else {
  app.use(helmet());
}
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.',
      details: {
        limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
        window_ms: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000
      }
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Health check endpoint with database status
app.get('/health', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbHealth ? 'connected' : 'disconnected',
    version: '1.0.0'
  });
});

// API routes
app.use(`/${API_VERSION}/prayer-times`, prayerTimesRoutes);
app.use(`/${API_VERSION}/fasting-times`, fastingTimesRoutes);
app.use(`/${API_VERSION}/sun-times`, sunTimesRoutes);
app.use(`/${API_VERSION}/calendar`, calendarRoutes);
app.use(`/${API_VERSION}/batch`, batchRoutes);
app.use(`/${API_VERSION}/locations`, locationsRoutes);
app.use(`/${API_VERSION}/methods`, methodsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Salat and Saom Timing API',
    version: '1.0.0',
    description: 'Coordinate-based Salat and Saom (Fasting) Timing API for Bangladesh',
    endpoints: {
      prayer_times: `/${API_VERSION}/prayer-times`,
      fasting_times: `/${API_VERSION}/fasting-times`,
      sun_times: `/${API_VERSION}/sun-times`,
      calendar_monthly: `/${API_VERSION}/calendar/monthly`,
      calendar_yearly: `/${API_VERSION}/calendar/yearly`,
      calendar_date_range: `/${API_VERSION}/calendar/date-range`,
      batch_prayer_times: `/${API_VERSION}/batch/prayer-times`,
      locations_search: `/${API_VERSION}/locations/search`,
      methods: `/${API_VERSION}/methods`
    },
    documentation: 'https://github.com/your-repo/salat-saom-api'
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/${API_VERSION}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;
