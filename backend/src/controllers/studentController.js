import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const createStudent = async (req, res) => {
  try {
    const { name, email, passwordHash, branch, year, cgpa, resumeUrl, interestAreas } = req.body;
    const student = await prisma.student.create({
      data: { name, email, passwordHash, branch, year, cgpa, resumeUrl, interestAreas },
    });
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create student", error: error.message });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.user.id },
      include: { skills: true, codingProfiles: true, applications: true, notifications: true },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const updateData = { ...req.body };

    // Extract coding profile links
    const codingProfilesData = [];
    if (updateData.githubProfile) codingProfilesData.push({ platform: 'GitHub', username: updateData.githubProfile });
    if (updateData.leetcodeProfile) codingProfilesData.push({ platform: 'LeetCode', username: updateData.leetcodeProfile });
    if (updateData.codeforcesProfile) codingProfilesData.push({ platform: 'Codeforces', username: updateData.codeforcesProfile });
    if (updateData.codechefProfile) codingProfilesData.push({ platform: 'CodeChef', username: updateData.codechefProfile });
    if (updateData.linkedinProfile) codingProfilesData.push({ platform: 'LinkedIn', username: updateData.linkedinProfile });

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.email;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.applications;
    delete updateData.skills;
    delete updateData.codingProfiles;
    delete updateData.notifications;

    // Convert year and cgpa to proper types if they exist
    if (updateData.year) {
      updateData.year = parseInt(updateData.year);
    }
    if (updateData.cgpa) {
      updateData.cgpa = parseFloat(updateData.cgpa);
    }

    // Update student basic info
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: updateData
    });

    // Update or create coding profiles
    for (const profile of codingProfilesData) {
      if (profile.username && profile.username.trim() !== '') {
        // Check if profile exists
        const existingProfile = await prisma.codingProfile.findUnique({
          where: {
            studentId_platformName: {
              studentId: studentId,
              platformName: profile.platform
            }
          }
        });

        if (existingProfile) {
          await prisma.codingProfile.update({
            where: { id: existingProfile.id },
            data: {
              username: profile.username,
              profileUrl: profile.username.startsWith('http') ? profile.username : `https://${profile.platform.toLowerCase()}.com/${profile.username}`
            }
          });
        } else {
          await prisma.codingProfile.create({
            data: {
              studentId: studentId,
              platformName: profile.platform,
              username: profile.username,
              profileUrl: profile.username.startsWith('http') ? profile.username : `https://${profile.platform.toLowerCase()}.com/${profile.username}`,
              rating: 0,
              problemsSolved: 0
            }
          });
        }
      }
    }

    // Fetch updated student with profiles
    const finalStudent = await prisma.student.findUnique({
      where: { id: studentId },
      include: { skills: true, codingProfiles: true, applications: true, notifications: true },
    });

    res.json(finalStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: { skills: true, codingProfiles: true, applications: true, notifications: true },
    });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch students", error: error.message });
  }
};
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: { skills: true, codingProfiles: true, applications: true, notifications: true },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch student", error: error.message });
  }
};
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update student", error: error.message });
  }
};
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({ where: { id } });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete student", error: error.message });
  }
};
