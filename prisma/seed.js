import pkg from "../generated/prisma/index.js";
const { PrismaClient } = pkg;
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
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

  const skill1 = await prisma.skill.create({ data: { name: "JavaScript" } });
  const skill2 = await prisma.skill.create({ data: { name: "React.js" } });
  const skill3 = await prisma.skill.create({ data: { name: "Node.js" } });
  const skill4 = await prisma.skill.create({ data: { name: "Python" } });
  const skill5 = await prisma.skill.create({ data: { name: "MongoDB" } });
  const skill6 = await prisma.skill.create({ data: { name: "SQL" } });
  const skill7 = await prisma.skill.create({ data: { name: "Machine Learning" } });
  const skill8 = await prisma.skill.create({ data: { name: "Tailwind CSS" } });

  const studentPassword = await bcrypt.hash("student123", SALT_ROUNDS);

  const student1 = await prisma.student.create({
    data: {
      name: "Arjun Mehta",
      email: "arjun.mehta@nsut.ac.in",
      passwordHash: studentPassword,
      branch: "Computer Science and Engineering",
      year: 3,
      cgpa: 8.7,
      interestAreas: "Full Stack Development, AI",
    },
  });

  const student2 = await prisma.student.create({
    data: {
      name: "Isha Patel",
      email: "isha.patel@vit.edu",
      passwordHash: studentPassword,
      branch: "Information Technology",
      year: 4,
      cgpa: 9.3,
      interestAreas: "Data Science, Cloud Computing",
    },
  });

  await prisma.studentSkill.createMany({
    data: [
      { studentId: student1.id, skillId: skill1.id },
      { studentId: student1.id, skillId: skill2.id },
      { studentId: student1.id, skillId: skill3.id },
      { studentId: student1.id, skillId: skill5.id },
      { studentId: student1.id, skillId: skill8.id },
      { studentId: student2.id, skillId: skill4.id },
      { studentId: student2.id, skillId: skill6.id },
      { studentId: student2.id, skillId: skill7.id },
    ],
  });

  await prisma.codingProfile.create({
    data: {
      studentId: student1.id,
      platformName: "GitHub",
      username: "ArjunM-dev",
      profileUrl: "https://github.com/ArjunM-dev",
      metadata: JSON.stringify({
        publicRepos: 38,
        followers: 210,
        contributions: 1720,
        topLanguages: ["JavaScript", "TypeScript", "Python"],
      }),
    },
  });

  await prisma.codingProfile.create({
    data: {
      studentId: student1.id,
      platformName: "LeetCode",
      username: "ArjunLeet",
      profileUrl: "https://leetcode.com/ArjunLeet",
      rating: 1925,
      problemsSolved: 410,
      metadata: JSON.stringify({
        contestRating: 2000,
        globalRank: 1098,
        contestAttended: 33,
        acceptanceRate: 89.2,
      }),
    },
  });

  await prisma.codingProfile.create({
    data: {
      studentId: student1.id,
      platformName: "CodeChef",
      username: "ArjunCC",
      profileUrl: "https://www.codechef.com/users/ArjunCC",
      rating: 2050,
      problemsSolved: 280,
      metadata: JSON.stringify({
        stars: 4,
        globalRank: 720,
        countryRank: 96,
        fullySolved: 230,
      }),
    },
  });

  await prisma.codingProfile.create({
    data: {
      studentId: student2.id,
      platformName: "GitHub",
      username: "IshaP-DS",
      profileUrl: "https://github.com/IshaP-DS",
      metadata: JSON.stringify({
        publicRepos: 24,
        followers: 135,
        contributions: 1032,
        topLanguages: ["Python", "R", "SQL"],
      }),
    },
  });

  await prisma.codingProfile.create({
    data: {
      studentId: student2.id,
      platformName: "Kaggle",
      username: "IshaKaggle",
      profileUrl: "https://kaggle.com/IshaKaggle",
      metadata: JSON.stringify({
        competitions: 12,
        notebooks: 34,
        medals: { gold: 2, silver: 5, bronze: 3 },
        followers: 220,
      }),
    },
  });

  await prisma.codingProfile.create({
    data: {
      studentId: student2.id,
      platformName: "LinkedIn",
      username: "isha-patel",
      profileUrl: "https://www.linkedin.com/in/isha-patel",
      metadata: JSON.stringify({
        connections: 600,
        certifications: ["AWS Cloud Practitioner", "Google Data Analytics"],
        skills: ["Machine Learning", "Python", "SQL", "Tableau"],
      }),
    },
  });

  const recruiterPassword = await bcrypt.hash("recruiter123", SALT_ROUNDS);

  const recruiter1 = await prisma.recruiter.create({
    data: {
      name: "Rahul Verma",
      email: "rahul.verma@infotech.in",
      passwordHash: recruiterPassword,
      companyName: "Infosys Technologies",
      industry: "IT Services",
      role: "Campus Recruiter",
    },
  });

  const recruiter2 = await prisma.recruiter.create({
    data: {
      name: "Neha Nair",
      email: "neha.nair@datawave.ai",
      passwordHash: recruiterPassword,
      companyName: "DataWave Analytics",
      industry: "AI & Data Science",
      role: "Talent Acquisition Manager",
    },
  });

  const job1 = await prisma.job.create({
    data: {
      recruiterId: recruiter1.id,
      title: "React Developer - Intern",
      description: "Build responsive web apps for Indian enterprise clients.",
      eligibility: "CGPA > 7.0, CSE/IT branches",
      skillsRequired: "JavaScript, React, Tailwind CSS, APIs",
      salaryPackage: 6.5,
      applicationDeadline: new Date("2025-11-25T23:59:59Z"),
    },
  });

  const job2 = await prisma.job.create({
    data: {
      recruiterId: recruiter2.id,
      title: "Data Analyst - Graduate Role",
      description: "Work on real-time Indian datasets and analytics pipelines.",
      eligibility: "CGPA > 8.0, All Engineering Branches",
      skillsRequired: "Python, SQL, PowerBI, ML Basics",
      salaryPackage: 10.0,
      applicationDeadline: new Date("2025-12-05T23:59:59Z"),
    },
  });

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

  await prisma.interview.create({
    data: {
      applicationId: application1.id,
      jobId: job1.id,
      interviewDate: new Date("2025-11-30T09:30:00Z"),
      mode: "Online",
      locationOrLink: "https://meet.google.com/dev-india",
      status: "scheduled",
    },
  });

  await prisma.notification.create({
    data: {
      studentId: student1.id,
      message:
        "You have been shortlisted for React Developer Intern at Infosys Technologies. Interview details sent to your email.",
    },
  });

  await prisma.notification.create({
    data: {
      studentId: student2.id,
      message:
        "Your application for Data Analyst at DataWave Analytics is under review.",
    },
  });

  await prisma.resource.createMany({
    data: [
      {
        title: "System Design Interview - Alex Xu",
        type: "Book",
        link: "https://www.amazon.in/dp/1736049119",
      },
      {
        title: "Scaler Data Science Course",
        type: "Online Course",
        link: "https://www.scaler.com/data-science-course/",
      },
      {
        title: "Frontend Development with React - Namaste React",
        type: "YouTube Playlist",
        link: "https://youtube.com/playlist?list=PL4cUxeGkcC9jLYyp2Aoh6hcWuxFDX6PBJ",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
