import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getJobRecommendations = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        skills: {
          include: {
            skill: true
          }
        }
      }
    });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    const studentSkills = student.skills.map(s => s.skill.name.toLowerCase());
    const { branch, cgpa } = student;
    const matchingJobs = await prisma.job.findMany({
      where: {
        status: 'open',
        ...(cgpa && { salaryPackage: { gte: 0 } }) 
      },
      include: {
        recruiter: {
          select: {
            name: true,
            companyName: true,
            companyWebsite: true,
            logoUrl: true
          }
        }
      }
    });
    const recommendedJobs = matchingJobs.map(job => {
      const jobSkills = job.skillsRequired 
        ? job.skillsRequired.split(',').map(s => s.trim().toLowerCase())
        : [];
      const matchingSkillsCount = jobSkills.filter(skill => 
        studentSkills.includes(skill)
      ).length;
      const matchScore = jobSkills.length > 0
        ? (matchingSkillsCount / jobSkills.length) * 100
        : 0;
      const cgpaRequirement = parseFloat(job.eligibility) || 0;
      const meetsCgpaRequirement = !cgpaRequirement || (student.cgpa >= cgpaRequirement);
      const branchRequirement = job.eligibility ? job.eligibility.includes(branch) : false;
      const meetsBranchRequirement = !branchRequirement || branch === null || branchRequirement;
      return {
        ...job,
        matchScore: meetsCgpaRequirement && meetsBranchRequirement ? matchScore : 0,
        meetsCgpaRequirement,
        meetsBranchRequirement,
        matchingSkills: jobSkills.filter(skill => studentSkills.includes(skill))
      };
    });
    recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);
    res.json({
      success: true,
      count: recommendedJobs.length,
      data: recommendedJobs
    });
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting job recommendations',
      error: error.message
    });
  }
};


export const getDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const applicationStats = await prisma.application.groupBy({
      by: ['status'],
      where: {
        studentId
      },
      _count: {
        id: true
      }
    });
    const formattedAppStats = applicationStats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {
      applied: 0,
      shortlisted: 0,
      interviewed: 0,
      rejected: 0,
      offered: 0,
      accepted: 0
    });
    const upcomingInterviews = await prisma.interview.findMany({
      where: {
        application: {
          studentId
        },
        interviewDate: {
          gte: new Date()
        }
      },
      include: {
        application: {
          include: {
            job: {
              include: {
                recruiter: {
                  select: {
                    companyName: true,
                    logoUrl: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        interviewDate: 'asc'
      },
      take: 5
    });
    const recentApplications = await prisma.application.findMany({
      where: {
        studentId
      },
      include: {
        job: {
          include: {
            recruiter: {
              select: {
                companyName: true,
                logoUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        appliedAt: 'desc'
      },
      take: 5
    });
    const totalMatchingJobs = await prisma.job.count({
      where: {
        status: 'open'
      }
    });
    const unreadNotifications = await prisma.notification.count({
      where: {
        studentId,
        isRead: false
      }
    });
    res.json({
      success: true,
      data: {
        applications: {
          total: Object.values(formattedAppStats).reduce((a, b) => a + b, 0),
          ...formattedAppStats
        },
        interviews: {
          upcoming: upcomingInterviews.length,
          next: upcomingInterviews[0] || null,
          list: upcomingInterviews
        },
        recentApplications,
        jobs: {
          matching: totalMatchingJobs
        },
        notifications: {
          unread: unreadNotifications
        }
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting dashboard statistics',
      error: error.message
    });
  }
};


export const getJobMatching = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { jobId } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        skills: {
          include: {
            skill: true
          }
        }
      }
    });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        recruiter: {
          select: {
            name: true,
            companyName: true,
            logoUrl: true
          }
        }
      }
    });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    const studentSkills = student.skills.map(s => s.skill.name.toLowerCase());
    const jobSkills = job.skillsRequired 
      ? job.skillsRequired.split(',').map(s => s.trim().toLowerCase())
      : [];
    const matchingSkills = jobSkills.filter(skill => 
      studentSkills.includes(skill)
    );
    const missingSkills = jobSkills.filter(skill => 
      !studentSkills.includes(skill)
    );
    const skillsMatchScore = jobSkills.length > 0
      ? (matchingSkills.length / jobSkills.length) * 100
      : 0;
    const cgpaRequirement = parseFloat(job.eligibility) || 0;
    const meetsCgpaRequirement = !cgpaRequirement || (student.cgpa >= cgpaRequirement);
    const cgpaMatchScore = meetsCgpaRequirement ? 100 : 
      (student.cgpa / cgpaRequirement) * 100;
    const branchRequirement = job.eligibility ? job.eligibility.includes(student.branch) : false;
    const meetsBranchRequirement = !branchRequirement || student.branch === null || branchRequirement;
    const overallMatchScore = (skillsMatchScore * 0.6) + (cgpaMatchScore * 0.4);
    res.json({
      success: true,
      data: {
        job,
        matching: {
          overall: Math.round(overallMatchScore),
          skills: {
            score: Math.round(skillsMatchScore),
            matching: matchingSkills,
            missing: missingSkills,
            total: jobSkills.length
          },
          cgpa: {
            score: Math.round(cgpaMatchScore),
            student: student.cgpa,
            required: cgpaRequirement,
            meets: meetsCgpaRequirement
          },
          branch: {
            meets: meetsBranchRequirement,
            student: student.branch,
            required: branchRequirement
          }
        }
      }
    });
  } catch (error) {
    console.error('Error getting job matching:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting job matching details',
      error: error.message
    });
  }
};
