import axios from 'axios';
import { createReadStream } from 'fs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const parseResume = async (filePath, fileUrl) => {
  try {
    console.log(`Parsing resume from ${filePath}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      name: null, 
      education: [
        {
          institution: 'Sample University',
          degree: 'Bachelor of Technology',
          field: 'Computer Science',
          startDate: '2018-08-01',
          endDate: '2022-05-01',
          gpa: '8.5'
        }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
      experience: [
        {
          company: 'Sample Company',
          title: 'Software Engineer Intern',
          startDate: '2021-05-01',
          endDate: '2021-08-01',
          description: 'Worked on web development projects using React and Node.js'
        }
      ],
      contact: {
        email: null, 
        phone: '+1234567890',
        linkedin: 'https://www.linkedin.com/in/sample-profile'
      }
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error(`Resume parsing failed: ${error.message}`);
  }
};
export const updateProfileFromResume = async (studentId, resumeData) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        skills: {
          include: {
            skill: true
          }
        }
      }
    });
    if (!student) {
      throw new Error('Student not found');
    }
    const updateData = {};
    if (resumeData.skills && resumeData.skills.length > 0) {
      for (const skillName of resumeData.skills) {
        let skill = await prisma.skill.findFirst({
          where: {
            name: {
              equals: skillName,
              mode: 'insensitive'
            }
          }
        });
        if (!skill) {
          skill = await prisma.skill.create({
            data: { name: skillName }
          });
        }
        const existingSkill = student.skills.find(s => 
          s.skill.name.toLowerCase() === skillName.toLowerCase()
        );
        if (!existingSkill) {
          await prisma.studentSkill.create({
            data: {
              studentId,
              skillId: skill.id
            }
          });
        }
      }
    }
    if (resumeData.education && resumeData.education.length > 0) {
      if (!student.cgpa && resumeData.education[0].gpa) {
        updateData.cgpa = parseFloat(resumeData.education[0].gpa);
      }
    }
    if (Object.keys(updateData).length > 0) {
      await prisma.student.update({
        where: { id: studentId },
        data: updateData
      });
    }
    return {
      success: true,
      message: 'Profile updated from resume',
      updatedFields: Object.keys(updateData),
      addedSkills: resumeData.skills
    };
  } catch (error) {
    console.error('Error updating profile from resume:', error);
    throw error;
  }
};
