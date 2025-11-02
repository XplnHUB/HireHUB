import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();



export const getApplicationStatistics = async (req, res) => {
  try {
    const { jobId, startDate, endDate } = req.query;
    const recruiterId = req.user.id;
    const jobWhere = {
      recruiterId
    };
    if (jobId) {
      jobWhere.id = jobId;
    }
    const jobs = await prisma.job.findMany({
      where: jobWhere,
      select: {
        id: true,
        title: true
      }
    });
    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No jobs found'
      });
    }
    const jobIds = jobs.map(job => job.id);
    const applicationWhere = {
      jobId: {
        in: jobIds
      }
    };
    if (startDate) {
      applicationWhere.appliedAt = {
        ...(applicationWhere.appliedAt || {}),
        gte: new Date(startDate)
      };
    }
    if (endDate) {
      applicationWhere.appliedAt = {
        ...(applicationWhere.appliedAt || {}),
        lte: new Date(endDate)
      };
    }
    const applicationCounts = await prisma.application.groupBy({
      by: ['jobId', 'status'],
      where: applicationWhere,
      _count: {
        id: true
      }
    });
    const totalApplicationsByJob = await prisma.application.groupBy({
      by: ['jobId'],
      where: applicationWhere,
      _count: {
        id: true
      }
    });
    const applicationsByDate = await prisma.application.groupBy({
      by: ['appliedAt'],
      where: applicationWhere,
      _count: {
        id: true
      },
      orderBy: {
        appliedAt: 'asc'
      }
    });
    const formattedData = jobs.map(job => {
      const jobApplicationCounts = applicationCounts
        .filter(count => count.jobId === job.id)
        .reduce((acc, count) => {
          acc[count.status] = count._count.id;
          return acc;
        }, {});
      const totalApplications = totalApplicationsByJob
        .find(total => total.jobId === job.id)?._count.id || 0;
      return {
        jobId: job.id,
        jobTitle: job.title,
        totalApplications,
        statusCounts: {
          applied: jobApplicationCounts.applied || 0,
          shortlisted: jobApplicationCounts.shortlisted || 0,
          interviewed: jobApplicationCounts.interviewed || 0,
          rejected: jobApplicationCounts.rejected || 0,
          offered: jobApplicationCounts.offered || 0,
          accepted: jobApplicationCounts.accepted || 0
        }
      };
    });
    const applicationTrend = applicationsByDate.map(item => ({
      date: item.appliedAt,
      count: item._count.id
    }));
    res.status(200).json({
      success: true,
      data: {
        jobStatistics: formattedData,
        applicationTrend
      }
    });
  } catch (error) {
    console.error('Error getting application statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get application statistics',
      error: error.message
    });
  }
};



export const getSelectionRatios = async (req, res) => {
  try {
    const { jobId } = req.query;
    const recruiterId = req.user.id;
    const jobWhere = {
      recruiterId
    };
    if (jobId) {
      jobWhere.id = jobId;
    }
    const jobs = await prisma.job.findMany({
      where: jobWhere,
      select: {
        id: true,
        title: true
      }
    });
    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No jobs found'
      });
    }
    const jobIds = jobs.map(job => job.id);
    const applications = await prisma.application.findMany({
      where: {
        jobId: {
          in: jobIds
        }
      },
      select: {
        id: true,
        jobId: true,
        status: true
      }
    });
    const selectionRatios = jobs.map(job => {
      const jobApplications = applications.filter(app => app.jobId === job.id);
      const totalApplications = jobApplications.length;
      if (totalApplications === 0) {
        return {
          jobId: job.id,
          jobTitle: job.title,
          totalApplications: 0,
          shortlistRatio: 0,
          interviewRatio: 0,
          offerRatio: 0,
          acceptanceRatio: 0
        };
      }
      const shortlistedCount = jobApplications.filter(app => 
        ['shortlisted', 'interviewed', 'offered', 'accepted'].includes(app.status)
      ).length;
      const interviewedCount = jobApplications.filter(app => 
        ['interviewed', 'offered', 'accepted'].includes(app.status)
      ).length;
      const offeredCount = jobApplications.filter(app => 
        ['offered', 'accepted'].includes(app.status)
      ).length;
      const acceptedCount = jobApplications.filter(app => 
        app.status === 'accepted'
      ).length;
      return {
        jobId: job.id,
        jobTitle: job.title,
        totalApplications,
        shortlistRatio: (shortlistedCount / totalApplications) * 100,
        interviewRatio: (interviewedCount / totalApplications) * 100,
        offerRatio: (offeredCount / totalApplications) * 100,
        acceptanceRatio: offeredCount > 0 ? (acceptedCount / offeredCount) * 100 : 0
      };
    });
    res.status(200).json({
      success: true,
      data: selectionRatios
    });
  } catch (error) {
    console.error('Error getting selection ratios:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get selection ratios',
      error: error.message
    });
  }
};



export const getSkillDistribution = async (req, res) => {
  try {
    const { jobId } = req.query;
    const recruiterId = req.user.id;
    if (jobId) {
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
    }
    const applications = await prisma.application.findMany({
      where: jobId ? {
        jobId
      } : {
        job: {
          recruiterId
        }
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
        }
      }
    });
    const skillsMap = {};
    applications.forEach(application => {
      application.student.skills.forEach(studentSkill => {
        const skillName = studentSkill.skill.name;
        if (skillsMap[skillName]) {
          skillsMap[skillName]++;
        } else {
          skillsMap[skillName] = 1;
        }
      });
    });
    const skillDistribution = Object.entries(skillsMap)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);
    const topSkills = skillDistribution.slice(0, 10);
    res.status(200).json({
      success: true,
      data: {
        totalApplicants: applications.length,
        skillDistribution,
        topSkills
      }
    });
  } catch (error) {
    console.error('Error getting skill distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get skill distribution',
      error: error.message
    });
  }
};



export const exportAnalyticsReport = async (req, res) => {
  try {
    const { jobId, reportType } = req.query;
    const recruiterId = req.user.id;
    if (!reportType || !['applications', 'selection', 'skills'].includes(reportType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report type. Must be "applications", "selection", or "skills"'
      });
    }
    if (jobId) {
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
    }
    let reportData = {};
    switch (reportType) {
      case 'applications':
        const applicationStats = await getApplicationStatisticsData(recruiterId, jobId);
        reportData = {
          reportType: 'Application Statistics',
          generatedAt: new Date(),
          data: applicationStats
        };
        break;
      case 'selection':
        const selectionRatios = await getSelectionRatiosData(recruiterId, jobId);
        reportData = {
          reportType: 'Selection Ratios',
          generatedAt: new Date(),
          data: selectionRatios
        };
        break;
      case 'skills':
        const skillDistribution = await getSkillDistributionData(recruiterId, jobId);
        reportData = {
          reportType: 'Skill Distribution',
          generatedAt: new Date(),
          data: skillDistribution
        };
        break;
    }
    res.status(200).json({
      success: true,
      message: 'Report generated successfully',
      data: reportData
    });
  } catch (error) {
    console.error('Error exporting analytics report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics report',
      error: error.message
    });
  }
};



export const getDashboardVisualizations = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobs = await prisma.job.findMany({
      where: {
        recruiterId
      },
      select: {
        id: true,
        title: true,
        status: true,
        _count: {
          select: {
            applications: true
          }
        }
      }
    });
    const applicationStatusCounts = await prisma.application.groupBy({
      by: ['status'],
      where: {
        job: {
          recruiterId
        }
      },
      _count: {
        id: true
      }
    });
    const formattedStatusCounts = applicationStatusCounts.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {
      applied: 0,
      shortlisted: 0,
      interviewed: 0,
      rejected: 0,
      offered: 0,
      accepted: 0
    });
    const recentApplications = await prisma.application.findMany({
      where: {
        job: {
          recruiterId
        }
      },
      take: 5,
      orderBy: {
        appliedAt: 'desc'
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
            branch: true,
            cgpa: true
          }
        },
        job: {
          select: {
            title: true
          }
        }
      }
    });
    const upcomingInterviews = await prisma.interview.findMany({
      where: {
        job: {
          recruiterId
        },
        interviewDate: {
          gte: new Date()
        }
      },
      take: 5,
      orderBy: {
        interviewDate: 'asc'
      },
      include: {
        application: {
          include: {
            student: {
              select: {
                name: true,
                email: true
              }
            },
            job: {
              select: {
                title: true
              }
            }
          }
        }
      }
    });
    res.status(200).json({
      success: true,
      data: {
        jobStats: {
          totalJobs: jobs.length,
          activeJobs: jobs.filter(job => job.status === 'open').length,
          jobs: jobs.map(job => ({
            id: job.id,
            title: job.title,
            status: job.status,
            applicationCount: job._count.applications
          }))
        },
        applicationStats: {
          total: Object.values(formattedStatusCounts).reduce((a, b) => a + b, 0),
          ...formattedStatusCounts
        },
        recentApplications: recentApplications.map(app => ({
          id: app.id,
          studentName: app.student.name,
          studentEmail: app.student.email,
          jobTitle: app.job.title,
          status: app.status,
          appliedAt: app.appliedAt
        })),
        upcomingInterviews: upcomingInterviews.map(interview => ({
          id: interview.id,
          studentName: interview.application.student.name,
          studentEmail: interview.application.student.email,
          jobTitle: interview.application.job.title,
          interviewDate: interview.interviewDate,
          mode: interview.mode
        }))
      }
    });
  } catch (error) {
    console.error('Error getting dashboard visualizations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard visualizations',
      error: error.message
    });
  }
};
async function getApplicationStatisticsData(recruiterId, jobId = null) {
  const jobWhere = { recruiterId };
  if (jobId) jobWhere.id = jobId;
  const jobs = await prisma.job.findMany({
    where: jobWhere,
    select: { id: true, title: true }
  });
  const jobIds = jobs.map(job => job.id);
  const applicationCounts = await prisma.application.groupBy({
    by: ['jobId', 'status'],
    where: { jobId: { in: jobIds } },
    _count: { id: true }
  });
  return jobs.map(job => {
    const jobApplicationCounts = applicationCounts
      .filter(count => count.jobId === job.id)
      .reduce((acc, count) => {
        acc[count.status] = count._count.id;
        return acc;
      }, {});
    return {
      jobId: job.id,
      jobTitle: job.title,
      statusCounts: {
        applied: jobApplicationCounts.applied || 0,
        shortlisted: jobApplicationCounts.shortlisted || 0,
        interviewed: jobApplicationCounts.interviewed || 0,
        rejected: jobApplicationCounts.rejected || 0,
        offered: jobApplicationCounts.offered || 0,
        accepted: jobApplicationCounts.accepted || 0
      }
    };
  });
}
async function getSelectionRatiosData(recruiterId, jobId = null) {
  const jobWhere = { recruiterId };
  if (jobId) jobWhere.id = jobId;
  const jobs = await prisma.job.findMany({
    where: jobWhere,
    select: { id: true, title: true }
  });
  const jobIds = jobs.map(job => job.id);
  const applications = await prisma.application.findMany({
    where: { jobId: { in: jobIds } },
    select: { id: true, jobId: true, status: true }
  });
  return jobs.map(job => {
    const jobApplications = applications.filter(app => app.jobId === job.id);
    const totalApplications = jobApplications.length;
    if (totalApplications === 0) {
      return {
        jobId: job.id,
        jobTitle: job.title,
        totalApplications: 0,
        ratios: {
          shortlist: 0,
          interview: 0,
          offer: 0,
          acceptance: 0
        }
      };
    }
    const shortlistedCount = jobApplications.filter(app => 
      ['shortlisted', 'interviewed', 'offered', 'accepted'].includes(app.status)
    ).length;
    const interviewedCount = jobApplications.filter(app => 
      ['interviewed', 'offered', 'accepted'].includes(app.status)
    ).length;
    const offeredCount = jobApplications.filter(app => 
      ['offered', 'accepted'].includes(app.status)
    ).length;
    const acceptedCount = jobApplications.filter(app => 
      app.status === 'accepted'
    ).length;
    return {
      jobId: job.id,
      jobTitle: job.title,
      totalApplications,
      ratios: {
        shortlist: (shortlistedCount / totalApplications) * 100,
        interview: (interviewedCount / totalApplications) * 100,
        offer: (offeredCount / totalApplications) * 100,
        acceptance: offeredCount > 0 ? (acceptedCount / offeredCount) * 100 : 0
      }
    };
  });
}
async function getSkillDistributionData(recruiterId, jobId = null) {
  const where = jobId ? { jobId } : { job: { recruiterId } };
  const applications = await prisma.application.findMany({
    where,
    include: {
      student: {
        include: {
          skills: {
            include: {
              skill: true
            }
          }
        }
      }
    }
  });
  const skillsMap = {};
  applications.forEach(application => {
    application.student.skills.forEach(studentSkill => {
      const skillName = studentSkill.skill.name;
      if (skillsMap[skillName]) {
        skillsMap[skillName]++;
      } else {
        skillsMap[skillName] = 1;
      }
    });
  });
  return Object.entries(skillsMap)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);
};
