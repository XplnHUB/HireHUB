import express from 'express';
import { 
  getApplicationsByStudent,
  filterApplicationsByStatus,
  getApplicationTimeline
} from '../controllers/applicationTrackingController.js';
import { authenticate } from '../utils/authMiddleware.js';
const router = express.Router();
router.use(authenticate);
router.get('/student', getApplicationsByStudent);
router.get('/filter', filterApplicationsByStatus);
router.get('/:applicationId/timeline', getApplicationTimeline);
export default router;
