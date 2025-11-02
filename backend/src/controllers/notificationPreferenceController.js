import { PrismaClient } from '@prisma/client';
import { 
  sendApplicationStatusEmail, 
  sendInterviewEmail, 
  sendJobRecommendationEmail 
} from '../utils/emailService.js';


const prisma = new PrismaClient();


export const getNotificationPreferences = async (req, res) => {
  try {
    const studentId = req.user.id;
    let preferences = await prisma.notificationPreference.findUnique({
      where: { studentId }
    });
    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: {
          studentId,
          email: true,
          applicationUpdates: true,
          interviewReminders: true,
          jobRecommendations: true,
          platformAnnouncements: true
        }
      });
    }
    res.status(200).json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification preferences',
      error: error.message
    });
  }
};



export const updateNotificationPreferences = async (req, res) => {
  try {
    const studentId = req.user.id;
    const {
      email,
      applicationUpdates,
      interviewReminders,
      jobRecommendations,
      platformAnnouncements
    } = req.body;
    const preferences = await prisma.notificationPreference.upsert({
      where: { studentId },
      update: {
        email: email !== undefined ? email : undefined,
        applicationUpdates: applicationUpdates !== undefined ? applicationUpdates : undefined,
        interviewReminders: interviewReminders !== undefined ? interviewReminders : undefined,
        jobRecommendations: jobRecommendations !== undefined ? jobRecommendations : undefined,
        platformAnnouncements: platformAnnouncements !== undefined ? platformAnnouncements : undefined
      },
      create: {
        studentId,
        email: email !== undefined ? email : true,
        applicationUpdates: applicationUpdates !== undefined ? applicationUpdates : true,
        interviewReminders: interviewReminders !== undefined ? interviewReminders : true,
        jobRecommendations: jobRecommendations !== undefined ? jobRecommendations : true,
        platformAnnouncements: platformAnnouncements !== undefined ? platformAnnouncements : true
      }
    });
    res.status(200).json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: preferences
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences',
      error: error.message
    });
  }
};



export const sendApplicationStatusNotification = async (studentId, applicationId, status) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            recruiter: true
          }
        }
      }
    });
    if (!student || !application) {
      throw new Error('Student or application not found');
    }
    const preferences = await prisma.notificationPreference.findUnique({
      where: { studentId }
    });
    await prisma.notification.create({
      data: {
        studentId,
        message: `Your application for ${application.job.title} at ${application.job.recruiter.companyName} has been ${status}.`,
        isRead: false
      }
    });
    if (preferences?.email && preferences?.applicationUpdates) {
      await sendApplicationStatusEmail(
        student.email,
        student.name,
        application.job.title,
        application.job.recruiter.companyName,
        status
      );
    }
    return {
      success: true,
      message: 'Application status notification sent'
    };
  } catch (error) {
    console.error('Error sending application status notification:', error);
    throw error;
  }
};



export const sendInterviewNotification = async (studentId, interviewId) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        application: {
          include: {
            job: {
              include: {
                recruiter: true
              }
            }
          }
        }
      }
    });
    if (!student || !interview) {
      throw new Error('Student or interview not found');
    }
    const preferences = await prisma.notificationPreference.findUnique({
      where: { studentId }
    });
    await prisma.notification.create({
      data: {
        studentId,
        message: `Interview scheduled for ${interview.application.job.title} at ${interview.application.job.recruiter.companyName} on ${new Date(interview.interviewDate).toLocaleString()}.`,
        isRead: false
      }
    });
    if (preferences?.email && preferences?.interviewReminders) {
      await sendInterviewEmail(
        student.email,
        student.name,
        interview.application.job.title,
        interview.application.job.recruiter.companyName,
        interview.interviewDate,
        interview.locationOrLink
      );
    }
    return {
      success: true,
      message: 'Interview notification sent'
    };
  } catch (error) {
    console.error('Error sending interview notification:', error);
    throw error;
  }
};



export const sendJobRecommendationNotification = async (studentId, jobId, matchScore) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        recruiter: true
      }
    });
    if (!student || !job) {
      throw new Error('Student or job not found');
    }
    const preferences = await prisma.notificationPreference.findUnique({
      where: { studentId }
    });
    await prisma.notification.create({
      data: {
        studentId,
        message: `New job recommendation: ${job.title} at ${job.recruiter.companyName} (${Math.round(matchScore)}% match).`,
        isRead: false
      }
    });
    if (preferences?.email && preferences?.jobRecommendations) {
      await sendJobRecommendationEmail(
        student.email,
        student.name,
        job.title,
        job.recruiter.companyName,
        Math.round(matchScore)
      );
    }
    return {
      success: true,
      message: 'Job recommendation notification sent'
    };
  } catch (error) {
    console.error('Error sending job recommendation notification:', error);
    throw error;
  }
};
