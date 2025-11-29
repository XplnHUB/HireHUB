import express from 'express';
import {
  syncGitHubProfile,
  syncLeetCodeProfile,
  syncCodeforcesProfile,
  syncCodeChefProfile,
  linkLinkedInProfile,
  getStudentIntegrations,
  syncAllPlatforms,
  deleteIntegration
} from '../controllers/integrationController.js';
import { authenticate } from '../utils/authMiddleware.js';
const router = express.Router();
router.get('/student/:studentId', getStudentIntegrations);
router.post('/student/:studentId/github', syncGitHubProfile);
router.post('/student/:studentId/leetcode', syncLeetCodeProfile);
router.post('/student/:studentId/codeforces', syncCodeforcesProfile);
router.post('/student/:studentId/codechef', syncCodeChefProfile);
router.post('/student/:studentId/linkedin', linkLinkedInProfile);
router.post('/student/:studentId/sync-all', syncAllPlatforms);
router.delete('/student/:studentId/:platform', deleteIntegration);
router.post('/student/:studentId/github', authenticate, syncGitHubProfile);
router.post('/student/:studentId/leetcode', authenticate, syncLeetCodeProfile);
router.post('/student/:studentId/codeforces', authenticate, syncCodeforcesProfile);
router.post('/student/:studentId/codechef', authenticate, syncCodeChefProfile);
router.post('/student/:studentId/linkedin', authenticate, linkLinkedInProfile);
router.post('/student/:studentId/sync-all', authenticate, syncAllPlatforms);
router.delete('/student/:studentId/:platform', authenticate, deleteIntegration);
export default router;
