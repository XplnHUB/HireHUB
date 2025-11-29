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
    const recruiters = await prisma.recruiter.findMany({
      include: { jobs: true },
    });
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

// Dashboard Endpoints

export const getRecruiterCompany = async (req, res) => {
  try {
    const recruiter = await prisma.recruiter.findUnique({
      where: { id: req.user.id }
    });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    // Transform to match frontend expectation
    const companyData = {
      name: recruiter.companyName,
      website: recruiter.companyWebsite,
      description: recruiter.companyDescription || "", // Assuming schema has this or we add it
      mission: "", // Placeholder if not in schema
      linkedin: "",
      twitter: "",
      location: "",
      logo: recruiter.logoUrl,
      cover: null,
      team: [] // Placeholder
    };

    res.json(companyData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch company", error: error.message });
  }
};

export const updateRecruiterCompany = async (req, res) => {
  try {
    const { name, website, description } = req.body;
    const updatedRecruiter = await prisma.recruiter.update({
      where: { id: req.user.id },
      data: {
        companyName: name,
        companyWebsite: website,
        // Add other fields if they exist in schema
      }
    });
    res.json(updatedRecruiter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update company", error: error.message });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { recruiterId: req.user.id },
      include: { applications: true }
    });

    // Transform for frontend
    const formattedJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      department: job.department || "Engineering",
      type: job.type,
      location: job.location,
      applicants: job.applications.length,
      newApplicants: 0, // Mock for now
      status: 'Active', // Mock or derive from deadline
      posted: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'
    }));

    res.json(formattedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};

export const getRecruiterStats = async (req, res) => {
  try {
    const jobsCount = await prisma.job.count({ where: { recruiterId: req.user.id } });
    const applicationsCount = await prisma.application.count({
      where: { job: { recruiterId: req.user.id } }
    });

    res.json({
      activeJobs: jobsCount,
      totalCandidates: applicationsCount,
      hired: 0 // Mock
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

export const getRecruiterCandidates = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { job: { recruiterId: req.user.id } },
      include: {
        student: {
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          }
        },
        job: true
      }
    });

    const candidates = applications.map(app => ({
      id: app.id,
      studentId: app.student.id,
      name: app.student.name,
      email: app.student.email,
      role: app.job.title,
      jobId: app.job.id,
      stage: app.status.toLowerCase(), // Ensure matches frontend stages
      applied: new Date(app.appliedAt).toLocaleDateString(),
      appliedDate: new Date(app.appliedAt).toLocaleDateString(),

      // Student details
      branch: app.student.branch,
      year: app.student.year,
      cgpa: app.student.cgpa,
      experience: `Year ${app.student.year} • CGPA ${app.student.cgpa}`,
      education: `${app.student.branch} - Year ${app.student.year}`,
      skills: app.student.skills.map(s => s.skill.name),
      interestAreas: app.student.interestAreas,

      // Resume and links
      resume: app.student.resumeUrl,
      resumeUrl: app.student.resumeUrl,
      links: {
        github: app.student.githubProfile,
        linkedin: app.student.linkedinProfile,
        leetcode: app.student.leetcodeProfile
      }
    }));

    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch candidates", error: error.message });
  }
};

export const getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Get all applications for this recruiter's jobs
    const applications = await prisma.application.findMany({
      where: { job: { recruiterId } },
      include: {
        student: {
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          }
        },
        job: true
      }
    });

    // Get active jobs count
    const activeJobs = await prisma.job.count({
      where: { recruiterId, status: 'open' }
    });

    // Calculate metrics
    const totalApplicants = applications.length;
    const hiredApplicants = applications.filter(app => app.status.toLowerCase() === 'hired');
    const hiredCount = hiredApplicants.length;
    const hireRate = totalApplicants > 0 ? ((hiredCount / totalApplicants) * 100).toFixed(0) : 0;

    // Calculate pipeline stats
    const pipelineCounts = {
      applied: applications.filter(app => app.status.toLowerCase() === 'applied').length,
      shortlisted: applications.filter(app => app.status.toLowerCase() === 'shortlisted').length,
      interview: applications.filter(app => app.status.toLowerCase() === 'interview').length,
      hired: hiredCount
    };

    const pipeline = [
      { stage: 'Applied', count: pipelineCounts.applied, drop: 0 },
      {
        stage: 'Shortlisted',
        count: pipelineCounts.shortlisted,
        drop: pipelineCounts.applied > 0 ? Math.round(((pipelineCounts.applied - pipelineCounts.shortlisted) / pipelineCounts.applied) * 100) : 0
      },
      {
        stage: 'Interview',
        count: pipelineCounts.interview,
        drop: pipelineCounts.shortlisted > 0 ? Math.round(((pipelineCounts.shortlisted - pipelineCounts.interview) / pipelineCounts.shortlisted) * 100) : 0
      },
      {
        stage: 'Hired',
        count: pipelineCounts.hired,
        drop: pipelineCounts.interview > 0 ? Math.round(((pipelineCounts.interview - pipelineCounts.hired) / pipelineCounts.interview) * 100) : 0
      }
    ];

    // Calculate top skills
    const skillCounts = {};
    applications.forEach(app => {
      app.student.skills.forEach(({ skill }) => {
        skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({
        name,
        count: totalApplicants > 0 ? Math.round((count / totalApplicants) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate average time to hire (simplified - using days since application)
    let avgDaysToHire = 0;
    if (hiredApplicants.length > 0) {
      const totalDays = hiredApplicants.reduce((sum, app) => {
        const daysToHire = Math.ceil((new Date() - new Date(app.appliedAt)) / (1000 * 60 * 60 * 24));
        return sum + daysToHire;
      }, 0);
      avgDaysToHire = Math.round(totalDays / hiredApplicants.length);
    }

    res.json({
      applicants: { value: totalApplicants, change: 0, trend: 'neutral' },
      timeToHire: { value: `${avgDaysToHire} days`, change: '0 days', trend: 'neutral' },
      hireRate: { value: `${hireRate}%`, change: '0%', trend: 'neutral' },
      activeJobs: { value: activeJobs, change: 0, trend: 'neutral' },
      topSkills,
      pipeline
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: "Failed to fetch analytics", error: error.message });
  }
};

export const getRecruiterTeam = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Get all hired applications for this recruiter
    const hiredApplications = await prisma.application.findMany({
      where: {
        job: { recruiterId },
        status: 'hired'
      },
      include: {
        student: {
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          }
        },
        job: true
      }
    });

    // Transform to team member format
    const teamMembers = hiredApplications.map(app => ({
      id: app.student.id,
      name: app.student.name,
      email: app.student.email,
      role: app.job.title,  // Job they were hired for
      position: app.job.title,
      branch: app.student.branch,
      year: app.student.year,
      cgpa: app.student.cgpa,
      skills: app.student.skills.map(s => s.skill.name),
      joinedDate: new Date(app.appliedAt).toLocaleDateString(),
      avatar: null  // Placeholder for profile picture
    }));

    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: "Failed to fetch team members", error: error.message });
  }
};
