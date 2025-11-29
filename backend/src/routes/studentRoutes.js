import express from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  updateStudentProfile,
} from "../controllers/studentController.js";
import { authenticate } from "../utils/authMiddleware.js";
const router = express.Router();

// Specific routes MUST come before parameterized routes
router.get("/profile", authenticate, getStudentProfile);
router.put("/profile", authenticate, updateStudentProfile);

// General CRUD routes
router.post("/", createStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
