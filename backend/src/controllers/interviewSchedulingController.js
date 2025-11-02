import { PrismaClient } from '@prisma/client';
import { sendInterviewEmail } from '../utils/emailService.js';
import { createMeeting as createGoogleMeet } from '../utils/googleMeetService.js';
import { createMeeting as createZoomMeeting } from '../utils/zoomService.js';


const prisma = new PrismaClient();


export const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      interviewDate,
      mode,
      locationOrLink,
      meetingProvider,
      sendNotification = true
    } = req.body;
    const recruiterId = req.user.id;
    if (!applicationId || !interviewDate) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and interview date are required'
      });
    }
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
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
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or access denied'
      });
    }
    let meetingDetails = null;
    let meetingLink = locationOrLink;
    let meetingId = null;
    let meetingPassword = null;
    if (meetingProvider) {
      const meetingTitle = `Interview: ${application.job.title} - ${application.student.name}`;
      const meetingDescription = `Interview for ${application.job.title} position at ${application.job.recruiter.companyName}`;
      const meetingTime = new Date(interviewDate);
      const meetingDuration = 60; 
      const attendees = [application.student.email, application.job.recruiter.email];
      try {
        if (meetingProvider === 'google_meet') {
          const googleMeetDetails = await createGoogleMeet(
            meetingTitle,
            meetingDescription,
            meetingTime,
            meetingDuration,
            attendees
          );
          meetingDetails = googleMeetDetails;
          meetingLink = googleMeetDetails.meetingLink;
          meetingId = googleMeetDetails.meetingId;
        } else if (meetingProvider === 'zoom') {
          const zoomMeetingDetails = await createZoomMeeting(
            meetingTitle,
            meetingDescription,
            meetingTime,
            meetingDuration,
            attendees
          );
          meetingDetails = zoomMeetingDetails;
          meetingLink = zoomMeetingDetails.meetingLink;
          meetingId = zoomMeetingDetails.meetingId;
          meetingPassword = zoomMeetingDetails.password;
        }
      } catch (error) {
        console.error(`Error creating ${meetingProvider} meeting:`, error);
      }
    }
    const interview = await prisma.interview.create({
      data: {
        applicationId,
        jobId: application.jobId,
        interviewDate: new Date(interviewDate),
        mode: mode || 'online',
        locationOrLink: meetingLink,
        meetingProvider,
        meetingId,
        meetingPassword,
        status: 'scheduled'
      }
    });
    if (application.status === 'applied' || application.status === 'shortlisted') {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: 'interviewed' }
      });
    }
    if (sendNotification) {
      try {
        await sendInterviewEmail(
          application.student.email,
          application.student.name,
          application.job.title,
          application.job.recruiter.companyName,
          interviewDate,
          meetingLink || locationOrLink
        );
        await prisma.interview.update({
          where: { id: interview.id },
          data: { emailNotificationSent: true }
        });
      } catch (error) {
        console.error('Error sending interview notification:', error);
      }
    }
    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: {
        interview,
        meetingDetails
      }
    });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule interview',
      error: error.message
    });
  }
};



export const addTestLinks = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { testLinks } = req.body;
    const recruiterId = req.user.id;
    if (!testLinks || !Array.isArray(testLinks) || testLinks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Test links are required'
      });
    }
    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        job: {
          recruiterId
        }
      }
    });
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found or access denied'
      });
    }
    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        testLinks: {
          push: testLinks
        }
      }
    });
    res.status(200).json({
      success: true,
      message: 'Test links added successfully',
      data: updatedInterview
    });
  } catch (error) {
    console.error('Error adding test links:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add test links',
      error: error.message
    });
  }
};


export const createAssignment = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const {
      title,
      description,
      fileUrl,
      deadline
    } = req.body;
    const recruiterId = req.user.id;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Assignment title is required'
      });
    }
    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        job: {
          recruiterId
        }
      },
      include: {
        application: {
          include: {
            student: true
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
    const assignment = await prisma.interviewAssignment.create({
      data: {
        interviewId,
        title,
        description,
        fileUrl,
        deadline: deadline ? new Date(deadline) : null
      }
    });
    try {
    } catch (error) {
      console.error('Error sending assignment notification:', error);
    }
    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment',
      error: error.message
    });
  }
};


export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { submissionUrl } = req.body;
    const studentId = req.user.id;
    if (!submissionUrl) {
      return res.status(400).json({
        success: false,
        message: 'Submission URL is required'
      });
    }
    const assignment = await prisma.interviewAssignment.findFirst({
      where: {
        id: assignmentId,
        interview: {
          application: {
            studentId
          }
        }
      }
    });
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found or access denied'
      });
    }
    if (assignment.deadline && new Date() > assignment.deadline) {
      return res.status(400).json({
        success: false,
        message: 'Assignment deadline has passed'
      });
    }
    const updatedAssignment = await prisma.interviewAssignment.update({
      where: { id: assignmentId },
      data: {
        submissionUrl,
        submissionDate: new Date(),
        status: 'submitted'
      }
    });
    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: updatedAssignment
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit assignment',
      error: error.message
    });
  }
};



export const evaluateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { feedback, status = 'evaluated' } = req.body;
    const recruiterId = req.user.id;
    if (!feedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback is required'
      });
    }
    const assignment = await prisma.interviewAssignment.findFirst({
      where: {
        id: assignmentId,
        interview: {
          job: {
            recruiterId
          }
        }
      }
    });
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found or access denied'
      });
    }
    const updatedAssignment = await prisma.interviewAssignment.update({
      where: { id: assignmentId },
      data: {
        feedback,
        status
      }
    });
    res.status(200).json({
      success: true,
      message: 'Assignment evaluated successfully',
      data: updatedAssignment
    });
  } catch (error) {
    console.error('Error evaluating assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to evaluate assignment',
      error: error.message
    });
  }
};
