import express from "express";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllAsRead
} from "../controllers/notificationController.js";
import { authenticate } from "../utils/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createNotification);
router.get("/", getNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.patch("/read-all", markAllAsRead);

export default router;
