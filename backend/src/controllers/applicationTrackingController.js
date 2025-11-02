import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getApplicationsByStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const where = {
      studentId,
      ...(status && { status })
    };
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: {
            include: {
              recruiter: {
                select: {
                  name: true,
                  companyName: true,
                  logoUrl: true
                }
              }
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
        },
        skip,
        take: parseInt(limit)
      }),
      prisma.application.count({ where })
    ]);
    res.json({
      success: true,
      count: applications.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: applications
    });
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};


export const filterApplicationsByStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { status } = req.query;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status parameter is required'
      });
    }
    const applications = await prisma.application.findMany({
      where: {
        studentId,
        status
      },
      include: {
        job: {
          include: {
            recruiter: {
              select: {
                name: true,
                companyName: true,
                logoUrl: true
              }
            }
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
    });
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error filtering applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering applications',
      error: error.message
    });
  }
};



export const getApplicationTimeline = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const studentId = req.user.id;
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        studentId
      },
      include: {
        job: {
          include: {
            recruiter: {
              select: {
                name: true,
                companyName: true,
                logoUrl: true
              }
            }
          }
        },
        interviews: {
          orderBy: {
            interviewDate: 'asc'
          }
        },
        student: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or access denied'
      });
    }
    const timeline = [
      {
        date: application.appliedAt,
        type: 'application',
        status: 'applied',
        title: 'Application Submitted',
        description: `Applied for ${application.job.title} at ${application.job.recruiter.companyName}`
      }
    ];
    if (['shortlisted', 'interviewed', 'rejected', 'offered', 'accepted'].includes(application.status)) {
      timeline.push({
        date: new Date(application.appliedAt.getTime() + 86400000), 
        type: 'status_change',
        status: 'shortlisted',
        title: 'Application Shortlisted',
        description: `Your application was shortlisted by ${application.job.recruiter.companyName}`
      });
    }
    application.interviews.forEach(interview => {
      timeline.push({
        date: interview.interviewDate,
        type: 'interview',
        status: interview.status,
        title: `Interview ${interview.status === 'completed' ? 'Completed' : 'Scheduled'}`,
        description: `Interview for ${application.job.title} at ${application.job.recruiter.companyName}`,
        location: interview.locationOrLink,
        mode: interview.mode,
        feedback: interview.feedback
      });
    });
    if (['offered', 'accepted'].includes(application.status)) {
      const lastInterview = application.interviews[application.interviews.length - 1];
      const offerDate = lastInterview ? new Date(lastInterview.interviewDate.getTime() + 86400000) : new Date();
      timeline.push({
        date: offerDate,
        type: 'status_change',
        status: 'offered',
        title: 'Offer Received',
        description: `You received an offer for ${application.job.title} at ${application.job.recruiter.companyName}`
      });
    }
    if (application.status === 'accepted') {
      const offerEvent = timeline.find(event => event.status === 'offered');
      const acceptanceDate = offerEvent ? new Date(offerEvent.date.getTime() + 86400000) : new Date();
      timeline.push({
        date: acceptanceDate,
        type: 'status_change',
        status: 'accepted',
        title: 'Offer Accepted',
        description: `You accepted the offer for ${application.job.title} at ${application.job.recruiter.companyName}`
      });
    }
    if (application.status === 'rejected') {
      const lastEvent = timeline[timeline.length - 1];
      const rejectionDate = lastEvent ? new Date(lastEvent.date.getTime() + 86400000) : new Date();
      timeline.push({
        date: rejectionDate,
        type: 'status_change',
        status: 'rejected',
        title: 'Application Rejected',
        description: `Your application for ${application.job.title} at ${application.job.recruiter.companyName} was not successful`
      });
    }
    timeline.sort((a, b) => a.date - b.date);
    res.json({
      success: true,
      data: {
        application,
        timeline
      }
    });
  } catch (error) {
    console.error('Error fetching application timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application timeline',
      error: error.message
    });
  }
};
