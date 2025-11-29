import express from 'express';
import {
  searchCandidates,
  getApplicationsByJob,
  bulkUpdateApplications,
  compareCandidates,
  advancedSearch,
  fullTextSearch
} from '../controllers/searchController.js';
import { protect, authorize } from '../utils/authMiddleware.js';
const router = express.Router();
router.use(protect);
router.use(authorize('recruiter'));
router.get('/candidates', searchCandidates);
router.post('/compare-candidates', compareCandidates);
router.get('/applications/job/:jobId', getApplicationsByJob);
router.put('/applications/bulk-update', bulkUpdateApplications);
router.get('/advanced', advancedSearch);
router.get('/full-text', fullTextSearch);
export default router;
