import express from "express";
import {
  studentSignup,
  studentLogin,
  recruiterSignup,
  recruiterLogin,
  refresh,
  register,
  login
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

// Conditional validation middleware
const validateRegistration = (req, res, next) => {
  if (req.body.role === 'student') {
    return validateStudentData(req, res, next);
  } else if (req.body.role === 'recruiter') {
    return validateRecruiterData(req, res, next);
  }
  next();
};

router.post("/register", createUserLimiter, validateRegistration, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);

// Keep legacy routes for safety if needed, or remove them. 
// User asked to "Replace any incorrect routes", so we will stick to the new ones.
// But to be safe and avoid breaking if I missed something, I'll leave the specific ones accessible via the controller logic, 
// but the router will expose the generic ones. 
// Actually, I will remove the specific ones from the router export to force usage of /register and /login.

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
