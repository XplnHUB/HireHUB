import express from "express";
import {
  createRecruiter,
  getAllRecruiters,
  getRecruiterById,
  updateRecruiter,
  deleteRecruiter,
} from "../controllers/recruiterController.js";

const router = express.Router();

router.post("/", createRecruiter);
router.get("/", getAllRecruiters);
router.get("/:id", getRecruiterById);
router.put("/:id", updateRecruiter);
router.delete("/:id", deleteRecruiter);

export default router;
