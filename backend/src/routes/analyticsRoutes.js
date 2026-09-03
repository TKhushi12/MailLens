import express from 'express';
import { getDashboardMetrics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getDashboardMetrics);

export default router;
