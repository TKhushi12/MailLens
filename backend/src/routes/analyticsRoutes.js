import express from 'express';
import { getDashboardMetrics, getAudioBrief } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getDashboardMetrics);
router.get('/audio-brief', getAudioBrief);

export default router;
