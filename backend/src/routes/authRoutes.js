import express from "express";
import {
  studentSignup,
  studentLogin,
  recruiterSignup,
  recruiterLogin,
} from "../controllers/authController.js";
import {
  requestPasswordReset,
  resetPassword
} from "../controllers/passwordResetController.js";
import {
  sendVerificationEmail,
  verifyEmail
} from "../controllers/emailVerificationController.js";
import {
  validateStudentData,
  validateRecruiterData,
} from "../utils/validate.js";
import { validate, authValidationRules } from "../middleware/validator.js";
import { authLimiter, createUserLimiter } from "../middleware/rateLimiter.js";
import { authenticate } from "../utils/authMiddleware.js";
const router = express.Router();
router.post("/student/signup", createUserLimiter, validateStudentData, studentSignup);
router.post("/recruiter/signup", createUserLimiter, validateRecruiterData, recruiterSignup);
router.post("/student/login", authLimiter, studentLogin);
router.post("/recruiter/login", authLimiter, recruiterLogin);
router.post(
  "/password-reset/request",
  authLimiter,
  validate(authValidationRules.requestPasswordReset),
  requestPasswordReset
);
router.post(
  "/password-reset/reset",
  authLimiter,
  validate(authValidationRules.resetPassword),
  resetPassword
);
router.post(
  "/verify-email/send",
  authenticate,
  sendVerificationEmail
);
router.post(
  "/verify-email/verify",
  verifyEmail
);
export default router;
