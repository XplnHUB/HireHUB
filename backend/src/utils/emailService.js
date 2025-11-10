import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
const templates = {
  welcome: (name) => ({
    subject: 'Welcome to HireHUB!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to HireHUB, ${name}!</h2>
        <p>Thank you for joining our platform. We're excited to help you find your dream job!</p>
        <p>Get started by:</p>
        <ul>
          <li>Completing your profile</li>
          <li>Uploading your resume</li>
          <li>Connecting your coding profiles</li>
        </ul>
        <p>Best regards,<br>The HireHUB Team</p>
      </div>
    `
  }),
  applicationStatus: (name, jobTitle, company, status) => ({
    subject: `Application Update: ${jobTitle} at ${company}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Application Status Update</h2>
        <p>Hello ${name},</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been updated.</p>
        <p>New status: <strong>${status}</strong></p>
        <p>Log in to your HireHUB account to view more details.</p>
        <p>Best regards,<br>The HireHUB Team</p>
      </div>
    `
  }),
  interviewScheduled: (name, jobTitle, company, date, location) => ({
    subject: `Interview Scheduled: ${jobTitle} at ${company}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Interview Scheduled</h2>
        <p>Hello ${name},</p>
        <p>An interview has been scheduled for your application to <strong>${jobTitle}</strong> at <strong>${company}</strong>.</p>
        <p><strong>Date and Time:</strong> ${new Date(date).toLocaleString()}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p>Log in to your HireHUB account to view more details and prepare for your interview.</p>
        <p>Best regards,<br>The HireHUB Team</p>
      </div>
    `
  }),
  jobRecommendation: (name, jobTitle, company, matchScore) => ({
    subject: `Job Recommendation: ${jobTitle} at ${company}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Job Recommendation</h2>
        <p>Hello ${name},</p>
        <p>We found a job that matches your profile!</p>
        <p><strong>${jobTitle}</strong> at <strong>${company}</strong></p>
        <p>Match score: ${matchScore}%</p>
        <p>Log in to your HireHUB account to view more details and apply.</p>
        <p>Best regards,<br>The HireHUB Team</p>
      </div>
    `
  })
};
export const sendEmail = async (to, template, data) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('SMTP not configured. Email would have been sent to:', to);
      return {
        success: false,
        message: 'SMTP not configured'
      };
    }
    const templateFn = templates[template];
    if (!templateFn) {
      throw new Error(`Email template '${template}' not found`);
    }
    const { subject, html } = templateFn(...Object.values(data));
    const info = await transporter.sendMail({
      from: `"HireHUB" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email sent:', info.messageId);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
export const sendWelcomeEmail = async (to, name) => {
  return sendEmail(to, 'welcome', { name });
};
export const sendApplicationStatusEmail = async (to, name, jobTitle, company, status) => {
  return sendEmail(to, 'applicationStatus', { name, jobTitle, company, status });
};
export const sendInterviewEmail = async (to, name, jobTitle, company, date, location) => {
  return sendEmail(to, 'interviewScheduled', { name, jobTitle, company, date, location });
};
export const sendJobRecommendationEmail = async (to, name, jobTitle, company, matchScore) => {
  return sendEmail(to, 'jobRecommendation', { name, jobTitle, company, matchScore });
};
