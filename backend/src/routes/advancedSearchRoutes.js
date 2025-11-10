import express from 'express';
import {
  advancedCandidateSearch,
  getApplicationsByJob,
  bulkUpdateApplications,
  exportResumes,
  compareCandidates
} from '../controllers/advancedSearchController.js';
import { authenticate, authorizeRole } from '../utils/authMiddleware.js';
const router = express.Router();
router.use(authenticate);
router.use(authorizeRole('recruiter'));
router.get('/candidates', advancedCandidateSearch);
router.get('/applications/:jobId', getApplicationsByJob);
router.put('/applications/bulk-update', bulkUpdateApplications);
router.get('/applications/export-resumes', exportResumes);
router.post('/compare-candidates', compareCandidates);
export default router;
