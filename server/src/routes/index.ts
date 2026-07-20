import { Router } from 'express';
import healthRouter from './health.js';

const router = Router();

/**
 * Đăng ký tất cả các sub-routes tại đây
 * Ví dụ:
 *   router.use('/certificates', certificatesRouter);
 *   router.use('/users', usersRouter);
 */
router.use('/health', healthRouter);

export default router;
