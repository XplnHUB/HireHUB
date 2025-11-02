import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const createRecruiter = async (req, res) => {
  try {
    const { name, email, passwordHash, companyName, companyWebsite, industry, role, logoUrl } = req.body;
    const recruiter = await prisma.recruiter.create({
      data: { name, email, passwordHash, companyName, companyWebsite, industry, role, logoUrl },
    });
    res.status(201).json(recruiter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create recruiter", error: error.message });
  }
};


export const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await prisma.recruiter.findMany({ include: { jobs: true } });
    res.json(recruiters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch recruiters", error: error.message });
  }
};



export const getRecruiterById = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiter = await prisma.recruiter.findUnique({
      where: { id },
      include: { jobs: true },
    });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
    res.json(recruiter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch recruiter", error: error.message });
  }
};



export const updateRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecruiter = await prisma.recruiter.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedRecruiter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update recruiter", error: error.message });
  }
};



export const deleteRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.recruiter.delete({ where: { id } });
    res.json({ message: "Recruiter deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete recruiter", error: error.message });
  }
};
