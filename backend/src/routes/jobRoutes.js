import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { authenticate, authorizeRole } from "../utils/authMiddleware.js";
const router = express.Router();
router.post("/", authenticate, authorizeRole("recruiter"), createJob);
router.get("/", authenticate, getAllJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
export default router;
