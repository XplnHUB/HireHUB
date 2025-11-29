import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const createApplication = async (req, res) => {
  try {
    const { jobId } = req.body;
    const studentId = req.user.id; // Get from authenticated user
    const application = await prisma.application.create({
      data: {
        student: { connect: { id: studentId } },
        job: { connect: { id: jobId } }
      },
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



export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Get the application with job details
    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: true }
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
    });

    // If status is 'hired', decrease job openings
    if (status.toLowerCase() === 'hired' && application.job.openings > 0) {
      const updatedJob = await prisma.job.update({
        where: { id: application.jobId },
        data: { openings: { decrement: 1 } }
      });

      // If openings reach 0, automatically close the job
      if (updatedJob.openings === 0) {
        await prisma.job.update({
          where: { id: application.jobId },
          data: { status: 'closed' }
        });
      }
    }

    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update application status", error: error.message });
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
