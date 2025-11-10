import express from 'express';
import { authenticate } from '../utils/authMiddleware.js';
import {
  getCalendarAuthUrl,
  handleCalendarCallback,
  syncInterviewToCalendar,
  getCalendarStatus,
  disconnectCalendar
} from '../controllers/calendarController.js';
const router = express.Router();
router.use(authenticate);
router.get('/auth-url', getCalendarAuthUrl);
router.post('/callback', handleCalendarCallback);
router.post('/sync-interview/:interviewId', syncInterviewToCalendar);
router.get('/status', getCalendarStatus);
router.delete('/', disconnectCalendar);
export default router;
