import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const createInterview = async (req, res) => {
  try {
    const { applicationId, jobId, interviewDate, mode, locationOrLink, status, feedback } = req.body;
    const interview = await prisma.interview.create({
      data: { applicationId, jobId, interviewDate: new Date(interviewDate), mode, locationOrLink, status, feedback },
    });
    res.status(201).json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to schedule interview", error: error.message });
  }
};
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      include: { application: true, job: true },
    });
    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch interviews", error: error.message });
  }
};
export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await prisma.interview.findUnique({
      where: { id },
      include: { application: true, job: true },
    });
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch interview", error: error.message });
  }
};
export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update interview", error: error.message });
  }
};
export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.interview.delete({ where: { id } });
    res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete interview", error: error.message });
  }
};
