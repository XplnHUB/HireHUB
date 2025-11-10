import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const calendar = google.calendar('v3');
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
export const createMeeting = async (title, description, startTime, durationMinutes = 60, attendees = []) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google API credentials not configured');
    }
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
    const event = {
      summary: title,
      description,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC'
      },
      attendees: attendees.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      }
    };
    const mockMeetingId = `meet-${Math.random().toString(36).substring(2, 10)}`;
    const mockMeetingLink = `https://meet.google.com/${mockMeetingId}`;
    return {
      meetingId: mockMeetingId,
      meetingLink: mockMeetingLink,
      title,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      attendees
    };
  } catch (error) {
    console.error('Error creating Google Meet meeting:', error);
    throw error;
  }
};
export const getMeetingDetails = async (meetingId) => {
  try {
    return {
      meetingId,
      meetingLink: `https://meet.google.com/${meetingId}`,
      title: 'Mock Meeting',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      attendees: []
    };
  } catch (error) {
    console.error('Error getting Google Meet meeting details:', error);
    throw error;
  }
};
