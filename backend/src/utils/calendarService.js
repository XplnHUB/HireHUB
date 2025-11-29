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
export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent' 
  });
};
export const getTokens = async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw error;
  }
};
export const createCalendarEvent = async (tokens, eventDetails) => {
  try {
    oauth2Client.setCredentials(tokens);
    const {
      summary,
      description,
      location,
      startDateTime,
      endDateTime,
      attendees = [],
      timeZone = 'UTC'
    } = eventDetails;
    const event = {
      summary,
      description,
      location,
      start: {
        dateTime: startDateTime,
        timeZone
      },
      end: {
        dateTime: endDateTime,
        timeZone
      },
      attendees: attendees.map(email => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, 
          { method: 'popup', minutes: 30 } 
        ]
      }
    };
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      resource: event
    });
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};
export const createInterviewEvent = async (tokens, interview) => {
  const {
    jobTitle,
    companyName,
    interviewDate,
    duration = 60, 
    location,
    studentEmail,
    recruiterEmail
  } = interview;
  const startDateTime = new Date(interviewDate);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
  const eventDetails = {
    summary: `Interview: ${jobTitle} at ${companyName}`,
    description: `Job interview for ${jobTitle} position at ${companyName}.`,
    location,
    startDateTime: startDateTime.toISOString(),
    endDateTime: endDateTime.toISOString(),
    attendees: [studentEmail, recruiterEmail].filter(Boolean),
    timeZone: 'UTC'
  };
  return createCalendarEvent(tokens, eventDetails);
};
export const refreshTokens = async (tokens) => {
  try {
    oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token
    });
    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    throw error;
  }
};
