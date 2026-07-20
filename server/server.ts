import { createApp } from './src/app.js';
import { config } from './src/config/env.js';

const app = createApp();

const server = app.listen(config.PORT, config.HOST, () => {
  console.log('\x1b[32m%s\x1b[0m', '╔══════════════════════════════════════╗');
  console.log('\x1b[32m%s\x1b[0m', '║      ChainVerify API Server          ║');
  console.log('\x1b[32m%s\x1b[0m', '╚══════════════════════════════════════╝');
  console.log(`🚀 Server running at: http://${config.HOST}:${config.PORT}`);
  console.log(`📡 API Prefix     : ${config.API_PREFIX}`);
  console.log(`🌐 Environment    : ${config.NODE_ENV}`);
  console.log(`🔗 Health check   : http://localhost:${config.PORT}${config.API_PREFIX}/health`);
});

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
const gracefulShutdown = (signal: string) => {
  console.log(`\n⚠️  Nhận signal ${signal}, đang shutdown server...`);
  server.close(() => {
    console.log('✅ Server đã đóng kết nối an toàn.');
    process.exit(0);
  });

  // Force exit sau 10s nếu không đóng được
  setTimeout(() => {
    console.error('❌ Force exit sau 10s timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Bắt uncaught exception để tránh crash không kiểm soát
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});
