import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
export const studentSignup = async (req, res) => {
    try {
        const { name, email, passwordHash, branch, year, cgpa, resumeUrl, interestAreas } = req.body;
        const existingStudent = await prisma.student.findUnique({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({ message: "Student with this email already exists" });
        }
        const hashedPassword = await bcrypt.hash(passwordHash, SALT_ROUNDS);
        const student = await prisma.student.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                branch,
                year,
                cgpa,
                resumeUrl,
                interestAreas: interestAreas || [],
            },
        });
        const accessToken = jwt.sign({ id: student.id, role: "student" }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const refreshToken = jwt.sign({ id: student.id, role: "student" }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(201).json({ user: { ...student, role: "student" }, accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create student", error: error.message });
    }
};

export const studentLogin = async (req, res) => {
    try {
        const { email, passwordHash } = req.body;
        const student = await prisma.student.findUnique({ where: { email } });
        if (!student) return res.status(401).json({ message: "Invalid credentials" });
        const isPasswordValid = await bcrypt.compare(passwordHash, student.passwordHash);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

        const accessToken = jwt.sign({ id: student.id, role: "student" }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const refreshToken = jwt.sign({ id: student.id, role: "student" }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({ user: { ...student, role: "student" }, accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

export const recruiterSignup = async (req, res) => {
    try {
        const { name, email, passwordHash, companyName, companyWebsite, industry, role, logoUrl } = req.body;
        const existingRecruiter = await prisma.recruiter.findUnique({ where: { email } });
        if (existingRecruiter) {
            return res.status(400).json({ message: "Recruiter with this email already exists" });
        }
        const hashedPassword = await bcrypt.hash(passwordHash, SALT_ROUNDS);
        const recruiter = await prisma.recruiter.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                companyName,
                companyWebsite,
                industry,
                role,
                logoUrl,
            },
        });
        const accessToken = jwt.sign({ id: recruiter.id, role: "recruiter" }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const refreshToken = jwt.sign({ id: recruiter.id, role: "recruiter" }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(201).json({ user: { ...recruiter, role: "recruiter" }, accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create recruiter", error: error.message });
    }
};

export const recruiterLogin = async (req, res) => {
    try {
        const { email, passwordHash } = req.body;
        const recruiter = await prisma.recruiter.findUnique({ where: { email } });
        if (!recruiter) return res.status(401).json({ message: "Invalid credentials" });
        const isPasswordValid = await bcrypt.compare(passwordHash, recruiter.passwordHash);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

        const accessToken = jwt.sign({ id: recruiter.id, role: "recruiter" }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const refreshToken = jwt.sign({ id: recruiter.id, role: "recruiter" }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({ user: { ...recruiter, role: "recruiter" }, accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

export const register = async (req, res) => {
    const { role } = req.body;
    if (role === 'student') {
        return studentSignup(req, res);
    } else if (role === 'recruiter') {
        return recruiterSignup(req, res);
    } else {
        return res.status(400).json({ message: "Invalid or missing role" });
    }
};

export const login = async (req, res) => {
    const { role } = req.body;
    if (role === 'student') {
        return studentLogin(req, res);
    } else if (role === 'recruiter') {
        return recruiterLogin(req, res);
    } else {
        return res.status(400).json({ message: "Invalid or missing role" });
    }
};
