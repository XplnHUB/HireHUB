import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/emailService.js';


const prisma = new PrismaClient();
const SALT_ROUNDS = 10;


export const requestPasswordReset = async (req, res) => {
  try {
    const { email, userType = 'student' } = req.body;
    let user;
    if (userType === 'student') {
      user = await prisma.student.findUnique({ where: { email } });
    } else if (userType === 'recruiter') {
      user = await prisma.recruiter.findUnique({ where: { email } });
    } else if (userType === 'admin') {
      user = await prisma.admin.findUnique({ where: { email } });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); 
    if (userType === 'student') {
      await prisma.student.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetTokenHash,
          resetPasswordExpire: resetTokenExpiry
        }
      });
    } else if (userType === 'recruiter') {
      await prisma.recruiter.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetTokenHash,
          resetPasswordExpire: resetTokenExpiry
        }
      });
    } else if (userType === 'admin') {
      await prisma.admin.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetTokenHash,
          resetPasswordExpire: resetTokenExpiry
        }
      });
    }
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}?userType=${userType}`;
    const emailSent = await sendEmail(
      email,
      'passwordReset',
      {
        name: user.name,
        resetUrl
      }
    );
    if (!emailSent.success) {
      if (userType === 'student') {
        await prisma.student.update({
          where: { id: user.id },
          data: {
            resetPasswordToken: null,
            resetPasswordExpire: null
          }
        });
      } else if (userType === 'recruiter') {
        await prisma.recruiter.update({
          where: { id: user.id },
          data: {
            resetPasswordToken: null,
            resetPasswordExpire: null
          }
        });
      } else if (userType === 'admin') {
        await prisma.admin.update({
          where: { id: user.id },
          data: {
            resetPasswordToken: null,
            resetPasswordExpire: null
          }
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting password reset',
      error: error.message
    });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { token, password, userType = 'student' } = req.body;
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    let user;
    if (userType === 'student') {
      user = await prisma.student.findFirst({
        where: {
          resetPasswordToken: resetTokenHash,
          resetPasswordExpire: {
            gt: new Date()
          }
        }
      });
    } else if (userType === 'recruiter') {
      user = await prisma.recruiter.findFirst({
        where: {
          resetPasswordToken: resetTokenHash,
          resetPasswordExpire: {
            gt: new Date()
          }
        }
      });
    } else if (userType === 'admin') {
      user = await prisma.admin.findFirst({
        where: {
          resetPasswordToken: resetTokenHash,
          resetPasswordExpire: {
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
        message: 'Invalid or expired reset token'
      });
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    if (userType === 'student') {
      await prisma.student.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetPasswordToken: null,
          resetPasswordExpire: null
        }
      });
    } else if (userType === 'recruiter') {
      await prisma.recruiter.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetPasswordToken: null,
          resetPasswordExpire: null
        }
      });
    } else if (userType === 'admin') {
      await prisma.admin.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetPasswordToken: null,
          resetPasswordExpire: null
        }
      });
    }
    await sendEmail(
      user.email,
      'passwordResetConfirmation',
      {
        name: user.name
      }
    );
    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};
