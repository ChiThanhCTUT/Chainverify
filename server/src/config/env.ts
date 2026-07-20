import dotenv from 'dotenv';
import path from 'path';

// Load .env từ root project
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  HOST: process.env.HOST || '0.0.0.0',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 phút
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),

  // Blockchain
  RPC_URL: process.env.RPC_URL || 'https://rpc.sepolia.org',
  CHAIN_ID: parseInt(process.env.CHAIN_ID || '11155111', 10),

  // API
  API_PREFIX: process.env.API_PREFIX || '/api',
} as const;
