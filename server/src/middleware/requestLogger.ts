import { Request, Response, NextFunction } from 'express';

/**
 * Middleware ghi log request (custom logger bổ sung cho morgan)
 * Log thêm thời gian xử lý request
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 500
        ? '\x1b[31m' // Đỏ
        : res.statusCode >= 400
          ? '\x1b[33m' // Vàng
          : res.statusCode >= 300
            ? '\x1b[36m' // Cyan
            : '\x1b[32m'; // Xanh

    console.log(
      `${statusColor}[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)\x1b[0m`
    );
  });

  next();
};
