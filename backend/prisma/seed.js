import pkg from "../generated/prisma/index.js";
const { PrismaClient } = pkg;
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log("Clearing existing data...");
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.codingProfile.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.job.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.recruiter.deleteMany();
  await prisma.student.deleteMany();
  await prisma.resource.deleteMany();
  console.log("Database cleared.");

  console.log("Seeding skills...");
  const skill1 = await prisma.skill.create({ data: { name: "JavaScript" } });
  const skill2 = await prisma.skill.create({ data: { name: "React" } });
  const skill3 = await prisma.skill.create({ data: { name: "Node.js" } });
  const skill4 = await prisma.skill.create({ data: { name: "Python" } });
  const skill5 = await prisma.skill.create({ data: { name: "MongoDB" } });
  const skill6 = await prisma.skill.create({ data: { name: "SQL" } });
  console.log("Skills seeded.");

  console.log("Seeding students...");
  const studentPassword = await bcrypt.hash("student123", SALT_ROUNDS);
  const student1 = await prisma.student.create({
    data: {
      name: "Ansh Sharma",
      email: "ansh@example.com",
      passwordHash: studentPassword,
      branch: "Computer Science",
      year: 3,
      cgpa: 8.5,
      interestAreas: "Web Development, AI",
    },
  });

  const student2 = await prisma.student.create({
    data: {
      name: "Priya Singh",
      email: "priya@example.com",
      passwordHash: studentPassword,
      branch: "Information Technology",
      year: 4,
      cgpa: 9.1,
      interestAreas: "Data Science, Machine Learning",
    },
  });
  console.log("Students seeded.");

  console.log("Seeding student skills...");
  await prisma.studentSkill.createMany({
    data: [
      { studentId: student1.id, skillId: skill1.id },
      { studentId: student1.id, skillId: skill2.id },
      { studentId: student1.id, skillId: skill3.id },
      { studentId: student1.id, skillId: skill5.id },
      { studentId: student2.id, skillId: skill4.id },
      { studentId: student2.id, skillId: skill6.id },
    ],
  });
  console.log("Student skills seeded.");

  console.log("Seeding coding profiles...");
  await prisma.codingProfile.create({
    data: {
      studentId: student1.id,
      platformName: "LeetCode",
      username: "ansh_sharma_dev",
      profileUrl: "https://leetcode.com/ansh_sharma_dev",
      rating: 1850,
      problemsSolved: 300,
    },
  });
  await prisma.codingProfile.create({
    data: {
      studentId: student2.id,
      platformName: "HackerRank",
      username: "priyasingh_hr",
      profileUrl: "https://hackerrank.com/priyasingh_hr",
      problemsSolved: 150,
    },
  });
  console.log("Coding profiles seeded.");

  console.log("Seeding recruiters...");
  const recruiterPassword = await bcrypt.hash("recruiter123", SALT_ROUNDS);
  const recruiter1 = await prisma.recruiter.create({
    data: {
      name: "Ravi Kumar",
      email: "ravi.k@techcorp.com",
      passwordHash: recruiterPassword,
      companyName: "TechCorp",
      industry: "SaaS",
      role: "Talent Acquisition Specialist",
    },
  });
  const recruiter2 = await prisma.recruiter.create({
    data: {
      name: "Sunita Reddy",
      email: "sunita.r@datainsights.io",
      passwordHash: recruiterPassword,
      companyName: "Data Insights Inc.",
      industry: "Big Data",
      role: "HR Manager",
    },
  });
  console.log("Recruiters seeded.");

  console.log("Seeding jobs...");
  const job1 = await prisma.job.create({
    data: {
      recruiterId: recruiter1.id,
      title: "Frontend Developer (React)",
      description: "Join our team to build amazing user interfaces.",
      eligibility: "CGPA > 7.5, All branches",
      skillsRequired: "JavaScript, React, HTML, CSS",
      salaryPackage: 12.5,
      applicationDeadline: new Date("2025-10-30T23:59:59Z"),
    },
  });
  const job2 = await prisma.job.create({
    data: {
      recruiterId: recruiter2.id,
      title: "Data Analyst Intern",
      description: "Work with large datasets to extract meaningful insights.",
      eligibility: "CGPA > 8.0, CSE/IT/ECE",
      skillsRequired: "Python, SQL, Pandas, Data Visualization",
      salaryPackage: 8.0,
      applicationDeadline: new Date("2025-11-15T23:59:59Z"),
    },
  });
  console.log("Jobs seeded.");

  console.log("Seeding applications...");
  const application1 = await prisma.application.create({
    data: {
      studentId: student1.id,
      jobId: job1.id,
      status: "shortlisted",
    },
  });
  const application2 = await prisma.application.create({
    data: {
      studentId: student2.id,
      jobId: job2.id,
      status: "applied",
    },
  });
  console.log("Applications seeded.");

  console.log("Seeding interviews...");
  await prisma.interview.create({
    data: {
      applicationId: application1.id,
      jobId: job1.id,
      interviewDate: new Date("2025-11-05T10:00:00Z"),
      mode: "Online",
      locationOrLink: "https://meet.google.com/xyz-abc-pqr",
      status: "scheduled",
    },
  });
  console.log("Interviews seeded.");

  console.log("Seeding notifications...");
  await prisma.notification.create({
    data: {
      studentId: student1.id,
      message:
        "Congratulations! You have been shortlisted for the Frontend Developer role at TechCorp.",
    },
  });
  await prisma.notification.create({
    data: {
      studentId: student2.id,
      message:
        "Your application for the Data Analyst Intern role has been received.",
    },
  });
  console.log("Notifications seeded.");

  console.log("Seeding resources...");
  await prisma.resource.createMany({
    data: [
      {
        title: "Cracking the Coding Interview",
        type: "Book",
        link: "https://example.com/ctci",
      },
      {
        title: "React Official Docs",
        type: "Documentation",
        link: "https://react.dev",
      },
    ],
  });
  console.log("Resources seeded.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("\nSeed complete!");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });