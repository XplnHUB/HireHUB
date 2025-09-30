import express from "express";
import {
  createNotification,
  getNotificationsByStudent,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/student/:studentId", getNotificationsByStudent);
router.put("/:id/read", markNotificationAsRead);

export default router;
