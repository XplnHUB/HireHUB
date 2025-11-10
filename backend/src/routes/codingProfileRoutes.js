import express from "express";
import { createCodingProfile, getAllCodingProfiles } from "../controllers/codingProfileController.js";
const router = express.Router();
router.post("/", createCodingProfile);
router.get("/", getAllCodingProfiles);
export default router;
