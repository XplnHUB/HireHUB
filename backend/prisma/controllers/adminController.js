import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
export const adminSignup = async (req, res) => {
  try {
    const { name, email, password, role = 'admin' } = req.body;
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        passwordHash,
        role
      }
    });
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin',
      error: error.message
    });
  }
};
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({
      where: { email }
    });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message
    });
  }
};
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Error getting admin profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get admin profile',
      error: error.message
    });
  }
};
export const getPendingVerifications = async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const recruiters = await prisma.recruiter.findMany({
      where: {
        verificationStatus: status
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.status(200).json({
      success: true,
      count: recruiters.length,
      data: recruiters
    });
  } catch (error) {
    console.error('Error getting pending verifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending verifications',
      error: error.message
    });
  }
};



export const verifyCompany = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { status, notes } = req.body;
    const adminId = req.user.id;
    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "verified", "rejected", or "pending"'
      });
    }
    const updatedRecruiter = await prisma.recruiter.update({
      where: { id: recruiterId },
      data: {
        verificationStatus: status,
        verificationDate: new Date(),
        verifiedBy: adminId,
        verificationNotes: notes
      }
    });
    res.status(200).json({
      success: true,
      message: `Company ${status === 'verified' ? 'verified' : status === 'rejected' ? 'rejected' : 'set to pending'} successfully`,
      data: updatedRecruiter
    });
  } catch (error) {
    console.error('Error verifying company:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify company',
      error: error.message
    });
  }
};



export const getSystemAnalytics = async (req, res) => {
  try {
    const [
      studentCount,
      recruiterCount,
      jobCount,
      applicationCount,
      pendingVerificationCount
    ] = await Promise.all([
      prisma.student.count(),
      prisma.recruiter.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.recruiter.count({
        where: { verificationStatus: 'pending' }
      })
    ]);
    const applicationStatusDistribution = await prisma.application.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });
    const formattedStatusDistribution = applicationStatusDistribution.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {});
    const recentJobs = await prisma.job.findMany({
      take: 5,
      orderBy: {
        id: 'desc'
      },
      include: {
        recruiter: {
          select: {
            companyName: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });
    res.status(200).json({
      success: true,
      data: {
        counts: {
          students: studentCount,
          recruiters: recruiterCount,
          jobs: jobCount,
          applications: applicationCount,
          pendingVerifications: pendingVerificationCount
        },
        applicationStatusDistribution: formattedStatusDistribution,
        recentJobs: recentJobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.recruiter.companyName,
          applicationCount: job._count.applications,
          status: job.status
        }))
      }
    });
  } catch (error) {
    console.error('Error getting system analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system analytics',
      error: error.message
    });
  }
};


export const getUsers = async (req, res) => {
  try {
    const { type, page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * parseInt(limit);
    let users = [];
    let total = 0;
    const searchFilter = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};
    if (type === 'students') {
      [users, total] = await Promise.all([
        prisma.student.findMany({
          where: searchFilter,
          skip,
          take: parseInt(limit),
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.student.count({
          where: searchFilter
        })
      ]);
    } else if (type === 'recruiters') {
      [users, total] = await Promise.all([
        prisma.recruiter.findMany({
          where: searchFilter,
          skip,
          take: parseInt(limit),
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.recruiter.count({
          where: searchFilter
        })
      ]);
    } else if (type === 'admins') {
      [users, total] = await Promise.all([
        prisma.admin.findMany({
          where: searchFilter,
          skip,
          take: parseInt(limit),
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.admin.count({
          where: searchFilter
        })
      ]);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Must be "students", "recruiters", or "admins"'
      });
    }
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
};
