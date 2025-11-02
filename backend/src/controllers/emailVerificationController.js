import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailService.js';


const prisma = new PrismaClient();


export const sendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let user;
    if (userRole === 'student') {
      user = await prisma.student.findUnique({
        where: { id: userId }
      });
    } else if (userRole === 'recruiter') {
      user = await prisma.recruiter.findUnique({
        where: { id: userId }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role'
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); 
    if (userRole === 'student') {
      await prisma.student.update({
        where: { id: userId },
        data: {
          emailVerificationToken: verificationTokenHash,
          emailVerificationExpire: verificationTokenExpiry
        }
      });
    } else if (userRole === 'recruiter') {
      await prisma.recruiter.update({
        where: { id: userId },
        data: {
          emailVerificationToken: verificationTokenHash,
          emailVerificationExpire: verificationTokenExpiry
        }
      });
    }
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}?userType=${userRole}`;
    const emailSent = await sendEmail(
      user.email,
      'emailVerification',
      {
        name: user.name,
        verificationUrl
      }
    );
    if (!emailSent.success) {
      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending verification email',
      error: error.message
    });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token, userType = 'student' } = req.body;
    const verificationTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    let user;
    if (userType === 'student') {
      user = await prisma.student.findFirst({
        where: {
          emailVerificationToken: verificationTokenHash,
          emailVerificationExpire: {
            gt: new Date()
          }
        }
      });
    } else if (userType === 'recruiter') {
      user = await prisma.recruiter.findFirst({
        where: {
          emailVerificationToken: verificationTokenHash,
          emailVerificationExpire: {
            gt: new Date()
          }
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }
    if (userType === 'student') {
      await prisma.student.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpire: null
        }
      });
    } else if (userType === 'recruiter') {
      await prisma.recruiter.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpire: null
        }
      });
    }
    await sendEmail(
      user.email,
      'welcome',
      {
        name: user.name
      }
    );
    res.status(200).json({
      success: true,
      message: 'Email verification successful'
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: error.message
    });
  }
};
