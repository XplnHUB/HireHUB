import express from 'express';
import {
  adminSignup,
  adminLogin,
  getAdminProfile,
  getPendingVerifications,
  verifyCompany,
  getSystemAnalytics,
  getUsers
} from '../controllers/adminController.js';
import { authenticate, authorizeRole } from '../utils/authMiddleware.js';
const router = express.Router();
router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.use(authenticate);
router.use(authorizeRole('admin'));
router.get('/profile', getAdminProfile);
router.get('/verifications', getPendingVerifications);
router.put('/verifications/:recruiterId', verifyCompany);
router.get('/analytics', getSystemAnalytics);
router.get('/users', getUsers);
export default router;
