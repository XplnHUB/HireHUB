import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const createApplication = async (req, res) => {
  try {
    const { studentId, jobId, status } = req.body;
    const application = await prisma.application.create({
      data: { studentId, jobId, status },
    });
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create application", error: error.message });
  }
};


export const getAllApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: { student: true, job: true, interviews: true },
    });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};


export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await prisma.application.findUnique({
      where: { id },
      include: { student: true, job: true, interviews: true },
    });
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch application", error: error.message });
  }
};


export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update application", error: error.message });
  }
};


export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.application.delete({ where: { id } });
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete application", error: error.message });
  }
};