import express from "express";
import { createSkill, getAllSkills } from "../controllers/skillController.js";
const router = express.Router();
router.post("/", createSkill);
router.get("/", getAllSkills);
export default router;
