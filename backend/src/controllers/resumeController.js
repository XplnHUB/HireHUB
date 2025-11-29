import { PrismaClient } from '@prisma/client';
import { parseResume, updateProfileFromResume } from '../utils/resumeParser.js';
import fs from 'fs';
import path from 'path';
const prisma = new PrismaClient();
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded'
      });
    }
    const studentId = req.user.id;
    const resumeUrl = req.file.path || req.file.location || req.file.secure_url;
    const originalName = req.file.originalname;
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { resumeUrl }
    });

    // Automatically parse resume and update profile
    let parseResult = null;
    try {
      const resumeData = await parseResume(null, resumeUrl);
      parseResult = await updateProfileFromResume(studentId, resumeData);
    } catch (parseError) {
      console.error('Error auto-parsing resume:', parseError);
      // We don't fail the upload if parsing fails, but we log it
    }

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and processed successfully',
      data: {
        resumeUrl,
        originalName,
        parseResult
      }
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: error.message
    });
  }
};
export const parseAndUpdateFromResume = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    if (!student || !student.resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'No resume found. Please upload a resume first.'
      });
    }
    const resumeData = await parseResume(null, student.resumeUrl);
    const result = await updateProfileFromResume(studentId, resumeData);
    res.status(200).json({
      success: true,
      message: 'Resume parsed and profile updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to parse resume',
      error: error.message
    });
  }
};
export const getResume = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    if (!student || !student.resumeUrl) {
      return res.status(404).json({
        success: false,
        message: 'No resume found'
      });
    }
    res.status(200).json({
      success: true,
      data: {
        resumeUrl: student.resumeUrl
      }
    });
  } catch (error) {
    console.error('Error getting resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resume',
      error: error.message
    });
  }
};
export const deleteResume = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    if (!student || !student.resumeUrl) {
      return res.status(404).json({
        success: false,
        message: 'No resume found'
      });
    }
    await prisma.student.update({
      where: { id: studentId },
      data: { resumeUrl: null }
    });
    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume',
      error: error.message
    });
  }
};
