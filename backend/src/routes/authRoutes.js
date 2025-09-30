import express from "express";
import {
  studentSignup,
  studentLogin,
  recruiterSignup,
  recruiterLogin,
} from "../controllers/authController.js";
import {
  validateStudentData,
  validateRecruiterData,
} from "../utils/validate.js";

const router = express.Router();

router.post("/student/signup", validateStudentData, studentSignup);

router.post("/student/login", studentLogin);


router.post("/recruiter/signup", validateRecruiterData, recruiterSignup);


router.post("/recruiter/login", recruiterLogin);

export default router;
