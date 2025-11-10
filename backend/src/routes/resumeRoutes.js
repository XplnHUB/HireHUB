import express from 'express';
import { authenticate } from '../utils/authMiddleware.js';
import { uploadResume as uploadResumeMiddleware } from '../utils/fileUpload.js';
import {
  uploadResume,
  parseAndUpdateFromResume,
  getResume,
  deleteResume
} from '../controllers/resumeController.js';
const router = express.Router();
router.use(authenticate);
router.post('/upload', uploadResumeMiddleware.single('resume'), uploadResume);
router.post('/parse', parseAndUpdateFromResume);
router.get('/', getResume);
router.delete('/', deleteResume);
export default router;
