import express from "express";
import {
  createRecruiter,
  getAllRecruiters,
  getRecruiterById,
  updateRecruiter,
  deleteRecruiter,
  getRecruiterCompany,
  updateRecruiterCompany,
  getRecruiterJobs,
  getRecruiterStats,
  getRecruiterCandidates,
  getRecruiterAnalytics,
  getRecruiterTeam
} from "../controllers/recruiterController.js";
import { authenticate } from "../utils/authMiddleware.js";

const router = express.Router();

// Dashboard Routes (Must be before /:id to avoid conflict)
router.get("/company", authenticate, getRecruiterCompany);
router.put("/company", authenticate, updateRecruiterCompany);
router.get("/jobs", authenticate, getRecruiterJobs);
router.get("/stats", authenticate, getRecruiterStats);
router.get("/candidates", authenticate, getRecruiterCandidates);
router.get("/analytics", authenticate, getRecruiterAnalytics);
router.get("/team", authenticate, getRecruiterTeam);

// Standard CRUD
router.post("/", createRecruiter);
router.get("/", getAllRecruiters);
router.get("/:id", getRecruiterById);
router.put("/:id", updateRecruiter);
router.delete("/:id", deleteRecruiter);

export default router;
