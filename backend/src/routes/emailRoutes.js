import express from 'express';
import {
  getEmails,
  getEmailById,
  toggleReadStatus,
  toggleActionCompleted,
  reprocessWithAI,
  deleteEmail,
  seedDemo,
  simulateIncoming,
} from '../controllers/emailController.js';

const router = express.Router();

router.get('/', getEmails);
router.post('/seed', seedDemo);
router.post('/simulate', simulateIncoming);
router.get('/:id', getEmailById);
router.patch('/:id/read', toggleReadStatus);
router.patch('/:id/action', toggleActionCompleted);
router.post('/:id/reprocess', reprocessWithAI);
router.delete('/:id', deleteEmail);

export default router;
