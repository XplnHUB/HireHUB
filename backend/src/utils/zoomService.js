import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_API_BASE_URL = 'https://api.zoom.us/v2';
const generateZoomToken = () => {
  return 'mock_zoom_token';
};
export const createMeeting = async (topic, agenda, startTime, durationMinutes = 60, attendees = []) => {
  try {
    if (!ZOOM_API_KEY || !ZOOM_API_SECRET) {
      throw new Error('Zoom API credentials not configured');
    }
    const mockMeetingId = Math.floor(Math.random() * 1000000000);
    const mockPassword = Math.random().toString(36).substring(2, 8);
    const mockJoinUrl = `https://zoom.us/j/${mockMeetingId}?pwd=${mockPassword}`;
    return {
      meetingId: mockMeetingId.toString(),
      meetingLink: mockJoinUrl,
      password: mockPassword,
      topic,
      startTime: startTime.toISOString(),
      duration: durationMinutes,
      attendees
    };
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    throw error;
  }
};
export const getMeetingDetails = async (meetingId) => {
  try {
    return {
      meetingId,
      meetingLink: `https://zoom.us/j/${meetingId}`,
      password: 'mock123',
      topic: 'Mock Zoom Meeting',
      startTime: new Date().toISOString(),
      duration: 60,
      attendees: []
    };
  } catch (error) {
    console.error('Error getting Zoom meeting details:', error);
    throw error;
  }
};
