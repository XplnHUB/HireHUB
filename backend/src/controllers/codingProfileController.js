import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const createCodingProfile = async (req, res) => {
  try {
    const { studentId, platformName, username, profileUrl, rating, problemsSolved } = req.body;
    const profile = await prisma.codingProfile.create({
      data: { studentId, platformName, username, profileUrl, rating, problemsSolved },
    });
    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add coding profile", error: error.message });
  }
};
export const getAllCodingProfiles = async (req, res) => {
  try {
    const profiles = await prisma.codingProfile.findMany({ include: { student: true } });
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch coding profiles", error: error.message });
  }
};
