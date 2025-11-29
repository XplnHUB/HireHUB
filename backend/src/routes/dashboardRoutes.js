import express from 'express';
import {
  getJobRecommendations,
  getDashboardStats,
  getJobMatching,
  getDashboardActivity,
  getDashboardInterviews
} from '../controllers/dashboardController.js';
import { authenticate } from '../utils/authMiddleware.js';
const router = express.Router();
router.use(authenticate);
router.get('/recommendations', getJobRecommendations);
router.get('/stats', getDashboardStats);
router.get('/activity', getDashboardActivity);
router.get('/interviews', getDashboardInterviews);
router.get('/job-matching/:jobId', getJobMatching);
export default router;
