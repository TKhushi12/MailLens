import express from 'express';
import { generateReply, sendReply } from '../controllers/replyController.js';

const router = express.Router();

router.post('/generate', generateReply);
router.post('/send', sendReply);

export default router;
