import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createSkill = async (req, res) => {
  try {
    const { name } = req.body;
    const skill = await prisma.skill.create({ data: { name } });
    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create skill", error: error.message });
  }
};

export const getAllSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({ include: { students: true } });
    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch skills", error: error.message });
  }
};
