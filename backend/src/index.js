import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import studentRoutes from "./routes/studentRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import codingProfileRoutes from "./routes/codingProfileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/students", studentRoutes);
app.use("/recruiters", recruiterRoutes);
app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);
app.use("/interviews", interviewRoutes);
app.use("/skills", skillRoutes);
app.use("/coding-profiles", codingProfileRoutes);
app.use("/notifications", notificationRoutes);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
