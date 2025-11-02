import { PrismaClient } from '@prisma/client';
import { sendApplicationStatusEmail } from '../utils/emailService.js';


const prisma = new PrismaClient();
export const advancedCandidateSearch = async (req, res) => {
  try {
    const {
      branch,
      cgpaMin,
      cgpaMax,
      skills,
      codingPlatform,
      page = 1,
      limit = 10
    } = req.query;
    const skip = (page - 1) * parseInt(limit);
    const where = {};
    if (branch) {
      where.branch = branch;
    }
    if (cgpaMin || cgpaMax) {
      where.cgpa = {};
      if (cgpaMin) where.cgpa.gte = parseFloat(cgpaMin);
      if (cgpaMax) where.cgpa.lte = parseFloat(cgpaMax);
    }
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      where.skills = {
        some: {
          skill: {
            name: {
              in: skillsArray,
              mode: 'insensitive'
            }
          }
        }
      };
    }
    if (codingPlatform) {
      where.codingProfiles = {
        some: {
          platformName: {
            equals: codingPlatform,
            mode: 'insensitive'
          }
        }
      };
    }
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          skills: {
            include: {
              skill: true
            }
          },
          codingProfiles: true,
          applications: {
            select: {
              id: true,
              status: true,
              job: {
                select: {
                  title: true,
                  recruiter: {
                    select: {
                      companyName: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          cgpa: 'desc'
        }
      }),
      prisma.student.count({ where })
    ]);


    const formattedStudents = students.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      branch: student.branch,
      year: student.year,
      cgpa: student.cgpa,
      resumeUrl: student.resumeUrl,
      skills: student.skills.map(s => s.skill.name),
      codingProfiles: student.codingProfiles.map(profile => ({
        platform: profile.platformName,
        username: profile.username,
        rating: profile.rating,
        problemsSolved: profile.problemsSolved
      })),
      applicationCount: student.applications.length
    }));
    res.status(200).json({
      success: true,
      count: formattedStudents.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: formattedStudents
    });

  } catch (error) {
    console.error('Error in advanced candidate search:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search candidates',
      error: error.message
    });
  }
};



export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    const recruiterId = req.user.id;
    const skip = (page - 1) * parseInt(limit);
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        recruiterId
      }
    });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or access denied'
      });
    }
    const where = {
      jobId
    };
    if (status) {
      where.status = status;
    }
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          student: {
            include: {
              skills: {
                include: {
                  skill: true
                }
              },
              codingProfiles: true
            }
          },
          interviews: {
            orderBy: {
              interviewDate: 'desc'
            }
          }
        },
        orderBy: {
          appliedAt: 'desc'
        }
      }),
      prisma.application.count({ where })
    ]);
    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: applications
    });
  } catch (error) {
    console.error('Error getting applications by job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get applications',
      error: error.message
    });
  }
};



export const bulkUpdateApplications = async (req, res) => {
  try {
    const { applicationIds, status, sendEmail = true } = req.body;
    const recruiterId = req.user.id;
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Application IDs are required'
      });
    }
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    const applications = await prisma.application.findMany({
      where: {
        id: {
          in: applicationIds
        },
        job: {
          recruiterId
        }
      },
      include: {
        student: true,
        job: {
          include: {
            recruiter: true
          }
        }
      }
    });
    if (applications.length !== applicationIds.length) {
      return res.status(403).json({
        success: false,
        message: 'Some applications do not belong to your jobs'
      });
    }
    const updatePromises = applications.map(application =>
      prisma.application.update({
        where: { id: application.id },
        data: { status }
      })
    );
    const updatedApplications = await Promise.all(updatePromises);
    if (sendEmail) {
      const emailPromises = applications.map(application =>
        sendApplicationStatusEmail(
          application.student.email,
          application.student.name,
          application.job.title,
          application.job.recruiter.companyName,
          status
        ).catch(error => console.error(`Failed to send email to ${application.student.email}:`, error))
      );
      await Promise.all(emailPromises);
    }
    res.status(200).json({
      success: true,
      message: `${updatedApplications.length} applications updated to status: ${status}`,
      data: updatedApplications
    });
  } catch (error) {
    console.error('Error bulk updating applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update applications',
      error: error.message
    });
  }
};



export const exportResumes = async (req, res) => {
  try {
    const { jobId, status } = req.query;
    const recruiterId = req.user.id;
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        recruiterId
      }
    });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or access denied'
      });
    }
    const where = {
      jobId
    };
    if (status) {
      where.status = status;
    }
    const applications = await prisma.application.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            resumeUrl: true
          }
        }
      }
    });
    const resumeUrls = applications
      .filter(app => app.student.resumeUrl)
      .map(app => ({
        studentId: app.student.id,
        studentName: app.student.name,
        studentEmail: app.student.email,
        resumeUrl: app.student.resumeUrl
      }));
    res.status(200).json({
      success: true,
      count: resumeUrls.length,
      data: resumeUrls
    });
  } catch (error) {
    console.error('Error exporting resumes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export resumes',
      error: error.message
    });
  }
};



export const compareCandidates = async (req, res) => {
  try {
    const { studentIds, jobId } = req.body;
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least two student IDs are required'
      });
    }
    const students = await prisma.student.findMany({
      where: {
        id: {
          in: studentIds
        }
      },
      include: {
        skills: {
          include: {
            skill: true
          }
        },
        codingProfiles: true,
        applications: jobId ? {
          where: {
            jobId
          }
        } : true
      }
    });
    let job = null;
    let jobSkills = [];
    if (jobId) {
      job = await prisma.job.findUnique({
        where: { id: jobId }
      });
      if (job && job.skillsRequired) {
        jobSkills = job.skillsRequired.split(',').map(s => s.trim().toLowerCase());
      }
    }
    const comparisonData = students.map(student => {
      const studentSkills = student.skills.map(s => s.skill.name.toLowerCase());
      let skillMatchScore = 0;
      let matchingSkills = [];
      let missingSkills = [];
      if (job && jobSkills.length > 0) {
        matchingSkills = jobSkills.filter(skill => studentSkills.includes(skill));
        missingSkills = jobSkills.filter(skill => !studentSkills.includes(skill));
        skillMatchScore = jobSkills.length > 0 ? (matchingSkills.length / jobSkills.length) * 100 : 0;
      }
      const codingProfiles = {};
      student.codingProfiles.forEach(profile => {
        codingProfiles[profile.platformName.toLowerCase()] = {
          username: profile.username,
          rating: profile.rating,
          problemsSolved: profile.problemsSolved
        };
      });
      return {
        id: student.id,
        name: student.name,
        email: student.email,
        branch: student.branch,
        year: student.year,
        cgpa: student.cgpa,
        resumeUrl: student.resumeUrl,
        skills: studentSkills,
        codingProfiles,
        jobMatch: job ? {
          skillMatchScore: Math.round(skillMatchScore),
          matchingSkills,
          missingSkills,
          cgpaMatch: job.eligibility ? (student.cgpa >= parseFloat(job.eligibility)) : true,
          application: student.applications.length > 0 ? student.applications[0] : null
        } : null
      };
    });
    res.status(200).json({
      success: true,
      data: {
        job: job ? {
          id: job.id,
          title: job.title,
          skillsRequired: jobSkills,
          eligibility: job.eligibility
        } : null,
        candidates: comparisonData
      }
    });
  } catch (error) {
    console.error('Error comparing candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compare candidates',
      error: error.message
    });
  }
};
