import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { config } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import apiRouter from './routes/index.js';

export const createApp = (): Application => {
  const app = express();

  // ─── 1. Security Headers (Helmet) ────────────────────────────────────────
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false, // Cho phép embed nếu cần
    })
  );

  // ─── 2. CORS ─────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: config.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // ─── 3. Compression (gzip) ───────────────────────────────────────────────
  app.use(compression());

  // ─── 4. Body Parsers ─────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ─── 5. HTTP Request Logger (Morgan) ─────────────────────────────────────
  if (config.NODE_ENV !== 'test') {
    app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // ─── 6. Custom Request Logger ────────────────────────────────────────────
  app.use(requestLogger);

  // ─── 7. Rate Limiting ────────────────────────────────────────────────────
  const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
    standardHeaders: true,  // Trả về RateLimit-* headers theo RFC 6585
    legacyHeaders: false,   // Tắt X-RateLimit-* headers cũ
    message: {
      success: false,
      error: { message: 'Quá nhiều request, vui lòng thử lại sau.' },
    },
  });
  app.use(config.API_PREFIX, limiter);

  // ─── 8. API Routes ───────────────────────────────────────────────────────
  app.use(config.API_PREFIX, apiRouter);

  // ─── 9. 404 Handler ──────────────────────────────────────────────────────
  app.use(notFoundHandler);

  // ─── 10. Global Error Handler ────────────────────────────────────────────
  app.use(errorHandler);

  return app;
};
