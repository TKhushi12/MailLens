import express from 'express';
import {
  getGoogleAuthUrl,
  googleCallback,
  getAuthStatus,
  triggerSync,
} from '../controllers/authController.js';

const router = express.Router();

router.get('/google/url', getGoogleAuthUrl);
router.get('/google/callback', googleCallback);
router.get('/status', getAuthStatus);
router.post('/sync', triggerSync);

export default router;
