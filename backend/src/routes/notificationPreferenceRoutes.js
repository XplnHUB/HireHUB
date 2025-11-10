import express from 'express';
import { authenticate } from '../utils/authMiddleware.js';
import {
  getNotificationPreferences,
  updateNotificationPreferences
} from '../controllers/notificationPreferenceController.js';
const router = express.Router();
router.use(authenticate);
router.get('/', getNotificationPreferences);
router.put('/', updateNotificationPreferences);
export default router;
