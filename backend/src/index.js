import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { applySecurityMiddleware } from "./middleware/security.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import studentRoutes from "./routes/studentRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import codingProfileRoutes from "./routes/codingProfileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import applicationTrackingRoutes from "./routes/applicationTrackingRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import notificationPreferenceRoutes from "./routes/notificationPreferenceRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import advancedSearchRoutes from "./routes/advancedSearchRoutes.js";
import interviewSchedulingRoutes from "./routes/interviewSchedulingRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import resourceCategoryRoutes from "./routes/resourceCategoryRoutes.js";
dotenv.config();
const app = express();
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "https://hirehub-tau.vercel.app",
    "https://hirehub-tau.vercel.app/"
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
applySecurityMiddleware(app);
app.use(apiLimiter);
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/recruiters", recruiterRoutes);
app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);
app.use("/interviews", interviewRoutes);
app.use("/skills", skillRoutes);
app.use("/coding-profiles", codingProfileRoutes);
app.use("/notifications", notificationRoutes);
app.use("/integrations", integrationRoutes);
app.use("/api", searchRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/application-tracking", applicationTrackingRoutes);
app.use("/resume", resumeRoutes);
app.use("/notification-preferences", notificationPreferenceRoutes);
app.use("/calendar", calendarRoutes);
app.use("/admin", adminRoutes);
app.use("/advanced-search", advancedSearchRoutes);
app.use("/interview-scheduling", interviewSchedulingRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/resources", resourceRoutes);
app.use("/resource-categories", resourceCategoryRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to HireHub API");
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
