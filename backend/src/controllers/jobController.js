import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const createJob = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Debug log
    console.log('req.user.id:', req.user?.id); // Debug log

    const { title, description, eligibility, skillsRequired, salaryPackage, applicationDeadline, status, isRemote } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const job = await prisma.job.create({
      data: {
        recruiterId: req.user.id, // Get from authenticated user
        title,
        description,
        eligibility,
        skillsRequired,
        salaryPackage,
        applicationDeadline,
        status,
        isRemote: isRemote || false
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
      include: {
        applications: true,
        interviews: true,
        recruiter: {
          select: {
            companyName: true,
            logoUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const userId = req.user?.id;

    const jobsWithStatus = jobs.map(job => {
      const hasApplied = userId ? job.applications.some(app => app.studentId === userId) : false;

      // Remove sensitive application data for students/public
      const { applications, recruiter, ...jobData } = job;

      return {
        ...jobData,
        company: recruiter?.companyName || 'Unknown Company',
        logo: recruiter?.logoUrl,
        hasApplied,
        applicationCount: applications.length
      };
    });

    res.json(jobsWithStatus);
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
      include: {
        applications: true,
        interviews: true,
        recruiter: {
          select: {
            companyName: true,
            logoUrl: true
          }
        }
      },
    });
    if (!job) return res.status(404).json({ message: "Job not found" });

    const { recruiter, ...jobData } = job;
    const response = {
      ...jobData,
      company: recruiter?.companyName || 'Unknown Company',
      logo: recruiter?.logoUrl
    };

    res.json(response);
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
