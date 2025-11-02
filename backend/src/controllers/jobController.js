import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export const createJob = async (req, res) => {
  try {
    const { recruiterId, title, description, eligibility, skillsRequired, salaryPackage, applicationDeadline, status } = req.body;
    const job = await prisma.job.create({
      data: {
        recruiterId,
        title,
        description,
        eligibility,
        skillsRequired,
        salaryPackage,
        applicationDeadline,
        status
      },
    });
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create job", error: error.message });
  }
};


export const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: { applications: true, interviews: true },
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};


export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: { applications: true, interviews: true },
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch job", error: error.message });
  }
};


export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await prisma.job.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update job", error: error.message });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.job.delete({ where: { id } });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete job", error: error.message });
  }
};
