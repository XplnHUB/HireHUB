import express from 'express';
import {
  scheduleInterview,
  addTestLinks,
  createAssignment,
  submitAssignment,
  evaluateAssignment
} from '../controllers/interviewSchedulingController.js';
import { authenticate, authorizeRole } from '../utils/authMiddleware.js';
const router = express.Router();
router.use(authenticate);
router.post('/', authorizeRole('recruiter'), scheduleInterview);
router.put('/:interviewId/test-links', authorizeRole('recruiter'), addTestLinks);
router.post('/:interviewId/assignments', authorizeRole('recruiter'), createAssignment);
router.put('/assignments/:assignmentId/evaluate', authorizeRole('recruiter'), evaluateAssignment);
router.put('/assignments/:assignmentId/submit', submitAssignment);
export default router;
