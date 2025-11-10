import express from "express";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";
import { authenticate, authorizeRole } from "../utils/authMiddleware.js";
const router = express.Router();
router.post("/", createApplication);
router.get("/", getAllApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);
router.post("/", authenticate, authorizeRole("student"), createApplication);
export default router;
