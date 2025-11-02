import { PrismaClient } from '@prisma/client';
import {
  getAuthUrl,
  getTokens,
  createInterviewEvent,
  refreshTokens
} from '../utils/calendarService.js';

const prisma = new PrismaClient();


export const getCalendarAuthUrl = async (req, res) => {
  try {
    const authUrl = getAuthUrl();
    res.status(200).json({
      success: true,
      data: {
        authUrl
      }
    });
  } catch (error) {
    console.error('Error getting calendar auth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get calendar auth URL',
      error: error.message
    });
  }
};


export const handleCalendarCallback = async (req, res) => {
  try {
    const { code } = req.body;
    const studentId = req.user.id;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }
    const tokens = await getTokens(code);
    await prisma.calendarIntegration.upsert({
      where: { studentId },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: new Date(Date.now() + tokens.expiry_date)
      },
      create: {
        studentId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: new Date(Date.now() + tokens.expiry_date)
      }
    });
    res.status(200).json({
      success: true,
      message: 'Calendar integration successful'
    });
  } catch (error) {
    console.error('Error handling calendar callback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to handle calendar callback',
      error: error.message
    });
  }
};


export const syncInterviewToCalendar = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const studentId = req.user.id;
    const calendarIntegration = await prisma.calendarIntegration.findUnique({
      where: { studentId }
    });
    if (!calendarIntegration) {
      return res.status(400).json({
        success: false,
        message: 'Calendar not integrated. Please connect your Google Calendar first.'
      });
    }
    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        application: {
          studentId
        }
      },
      include: {
        application: {
          include: {
            student: true,
            job: {
              include: {
                recruiter: true
              }
            }
          }
        }
      }
    });
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found or access denied'
      });
    }
    const now = new Date();
    let tokens = {
      access_token: calendarIntegration.accessToken,
      refresh_token: calendarIntegration.refreshToken
    };
    if (calendarIntegration.expiryDate < now) {
      tokens = await refreshTokens(tokens);
      await prisma.calendarIntegration.update({
        where: { studentId },
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiryDate: new Date(Date.now() + tokens.expiry_date)
        }
      });
    }
    const event = await createInterviewEvent(tokens, {
      jobTitle: interview.application.job.title,
      companyName: interview.application.job.recruiter.companyName,
      interviewDate: interview.interviewDate,
      location: interview.locationOrLink,
      studentEmail: interview.application.student.email,
      recruiterEmail: interview.application.job.recruiter.email
    });
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        calendarEventId: event.id
      }
    });
    res.status(200).json({
      success: true,
      message: 'Interview synced to calendar successfully',
      data: {
        eventId: event.id,
        eventLink: event.htmlLink
      }
    });
  } catch (error) {
    console.error('Error syncing interview to calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync interview to calendar',
      error: error.message
    });
  }
};



export const getCalendarStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const calendarIntegration = await prisma.calendarIntegration.findUnique({
      where: { studentId }
    });
    res.status(200).json({
      success: true,
      data: {
        integrated: !!calendarIntegration,
        expiryDate: calendarIntegration?.expiryDate
      }
    });
  } catch (error) {
    console.error('Error checking calendar status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check calendar status',
      error: error.message
    });
  }
};



export const disconnectCalendar = async (req, res) => {
  try {
    const studentId = req.user.id;
    await prisma.calendarIntegration.delete({
      where: { studentId }
    });
    res.status(200).json({
      success: true,
      message: 'Calendar disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect calendar',
      error: error.message
    });
  }
};
