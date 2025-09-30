import express from "express";
import {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/", createInterview);
router.get("/", getAllInterviews);
router.get("/:id", getInterviewById);
router.put("/:id", updateInterview);
router.delete("/:id", deleteInterview);

export default router;
