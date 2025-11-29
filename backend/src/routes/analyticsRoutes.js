import express from 'express';
import {
  getApplicationStatistics,
  getSelectionRatios,
  getSkillDistribution,
  exportAnalyticsReport,
  getDashboardVisualizations
} from '../controllers/analyticsController.js';
import { authenticate, authorizeRole } from '../utils/authMiddleware.js';
const router = express.Router();
router.use(authenticate);
router.use(authorizeRole('recruiter'));
router.get('/applications', getApplicationStatistics);
router.get('/selection-ratios', getSelectionRatios);
router.get('/skill-distribution', getSkillDistribution);
router.get('/export', exportAnalyticsReport);
router.get('/dashboard', getDashboardVisualizations);
export default router;
