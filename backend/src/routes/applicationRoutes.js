import express from "express";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  updateApplicationStatus
} from "../controllers/applicationController.js";
import { authenticate, authorizeRole } from "../utils/authMiddleware.js";
const router = express.Router();

router.use(authenticate);

router.post("/", authorizeRole("student"), createApplication);
router.get("/", getAllApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.patch("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);
export default router;
