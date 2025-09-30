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
