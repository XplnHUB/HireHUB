import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log("Starting seed...");

  // Clean up existing data
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.codingProfile.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.job.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.recruiter.deleteMany();
  await prisma.student.deleteMany();
  await prisma.resourceAccess.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.resourceCategory.deleteMany();

  console.log("Cleaned up existing data.");

  // Create Skills
  const skillsData = [
    "JavaScript", "React.js", "Node.js", "Python", "MongoDB", "SQL",
    "Machine Learning", "Tailwind CSS", "Java", "C++", "AWS", "Docker",
    "Kubernetes", "Figma", "Next.js"
  ];

  const skills = [];
  for (const name of skillsData) {
    const skill = await prisma.skill.create({ data: { name } });
    skills.push(skill);
  }
  console.log(`Created ${skills.length} skills.`);

  const studentPassword = await bcrypt.hash("student123", SALT_ROUNDS);
  const recruiterPassword = await bcrypt.hash("recruiter123", SALT_ROUNDS);

  // --- Create 5 Students ---
  const studentsData = [
    {
      name: "Arjun Mehta",
      email: "arjun.mehta@nsut.ac.in",
      branch: "Computer Science",
      year: 3,
      cgpa: 8.7,
      interestAreas: ["Full Stack", "AI"],
      skills: [0, 1, 2, 4, 7] // Indices from skills array
    },
    {
      name: "Isha Patel",
      email: "isha.patel@vit.edu",
      branch: "Information Technology",
      year: 4,
      cgpa: 9.3,
      interestAreas: ["Data Science", "Cloud"],
      skills: [3, 5, 6, 10]
    },
    {
      name: "Rohan Gupta",
      email: "rohan.gupta@iitb.ac.in",
      branch: "Electrical Engineering",
      year: 4,
      cgpa: 8.1,
      interestAreas: ["Embedded Systems", "IoT"],
      skills: [8, 9, 3]
    },
    {
      name: "Ananya Singh",
      email: "ananya.singh@dtu.ac.in",
      branch: "Software Engineering",
      year: 3,
      cgpa: 9.5,
      interestAreas: ["Frontend", "UI/UX"],
      skills: [0, 1, 7, 13, 14]
    },
    {
      name: "Vikram Malhotra",
      email: "vikram.m@bits.edu",
      branch: "Computer Science",
      year: 2,
      cgpa: 7.8,
      interestAreas: ["DevOps", "Backend"],
      skills: [2, 4, 5, 11, 12]
    }
  ];

  const students = [];
  for (const s of studentsData) {
    const student = await prisma.student.create({
      data: {
        name: s.name,
        email: s.email,
        passwordHash: studentPassword,
        branch: s.branch,
        year: s.year,
        cgpa: s.cgpa,
        interestAreas: s.interestAreas,
      },
    });
    students.push(student);

    // Assign skills
    for (const skillIndex of s.skills) {
      await prisma.studentSkill.create({
        data: {
          studentId: student.id,
          skillId: skills[skillIndex].id,
        },
      });
    }
  }
  console.log(`Created ${students.length} students.`);

  // --- Create 5 Recruiters ---
  const recruitersData = [
    {
      name: "Rahul Verma",
      email: "rahul.verma@infotech.in",
      companyName: "Infosys Technologies",
      industry: "IT Services",
      role: "Campus Recruiter"
    },
    {
      name: "Neha Nair",
      email: "neha.nair@datawave.ai",
      companyName: "DataWave Analytics",
      industry: "AI & Data Science",
      role: "Talent Acquisition Manager"
    },
    {
      name: "Amit Kapoor",
      email: "amit.kapoor@zomato.com",
      companyName: "Zomato",
      industry: "Consumer Tech",
      role: "HR Lead"
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@flipkart.com",
      companyName: "Flipkart",
      industry: "E-commerce",
      role: "Senior Recruiter"
    },
    {
      name: "David Wilson",
      email: "david.wilson@microsoft.com",
      companyName: "Microsoft India",
      industry: "Technology",
      role: "University Recruiting"
    }
  ];

  const recruiters = [];
  for (const r of recruitersData) {
    const recruiter = await prisma.recruiter.create({
      data: {
        name: r.name,
        email: r.email,
        passwordHash: recruiterPassword,
        companyName: r.companyName,
        industry: r.industry,
        role: r.role,
      },
    });
    recruiters.push(recruiter);
  }
  console.log(`Created ${recruiters.length} recruiters.`);

  // --- Create Jobs (2 per recruiter) ---
  const jobs = [];
  for (const recruiter of recruiters) {
    const job1 = await prisma.job.create({
      data: {
        recruiterId: recruiter.id,
        title: `Software Engineer - ${recruiter.companyName}`,
        description: `Exciting opportunity to work at ${recruiter.companyName} as a Software Engineer.`,
        eligibility: "B.Tech/B.E in CS/IT",
        skillsRequired: "Java, Spring Boot, SQL",
        salaryPackage: Math.floor(Math.random() * 20) + 5, // Random package 5-25 LPA
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isRemote: Math.random() > 0.7, // 30% chance of remote
      },
    });
    jobs.push(job1);

    const job2 = await prisma.job.create({
      data: {
        recruiterId: recruiter.id,
        title: `Intern - ${recruiter.companyName}`,
        description: `Summer internship program at ${recruiter.companyName}.`,
        eligibility: "Pre-final year students",
        skillsRequired: "Problem Solving, DSA",
        salaryPackage: Math.floor(Math.random() * 10) + 2, // Random package 2-12 LPA
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        isRemote: Math.random() > 0.5, // 50% chance of remote
      },
    });
    jobs.push(job2);
  }
  console.log(`Created ${jobs.length} jobs.`);

  // --- Create Applications (Randomly apply students to jobs) ---
  for (const student of students) {
    // Each student applies to 3 random jobs
    const shuffledJobs = jobs.sort(() => 0.5 - Math.random());
    const selectedJobs = shuffledJobs.slice(0, 3);

    for (const job of selectedJobs) {
      const statusOptions = ["applied", "shortlisted", "rejected", "interview_scheduled"];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

      const application = await prisma.application.create({
        data: {
          studentId: student.id,
          jobId: job.id,
          status: status,
        },
      });

      // If interview scheduled, create interview
      if (status === "interview_scheduled") {
        await prisma.interview.create({
          data: {
            applicationId: application.id,
            jobId: job.id,
            interviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            mode: "Online",
            locationOrLink: "https://meet.google.com/abc-defg-hij",
            status: "scheduled",
          },
        });
      }
    }
  }
  console.log("Created applications and interviews.");

  // --- Create Resources ---
  const category = await prisma.resourceCategory.create({
    data: {
      name: "Placement Prep",
      description: "Essential resources for placement preparation",
    },
  });

  await prisma.resource.createMany({
    data: [
      {
        title: "Cracking the Coding Interview",
        type: "Book",
        link: "https://www.amazon.in/Cracking-Coding-Interview-Programming-Questions/dp/0984782850",
        categoryId: category.id,
        tags: ["DSA", "Interview"],
      },
      {
        title: "NeetCode 150",
        type: "Website",
        link: "https://neetcode.io/",
        categoryId: category.id,
        tags: ["DSA", "Practice"],
      },
      {
        title: "System Design Primer",
        type: "GitHub Repo",
        link: "https://github.com/donnemartin/system-design-primer",
        categoryId: category.id,
        tags: ["System Design", "Architecture"],
      },
      {
        title: "CS Fundamentals for Interviews",
        type: "Article",
        link: "https://www.geeksforgeeks.org/computer-science-subjects-for-placement-interviews/",
        categoryId: category.id,
        tags: ["CS Fundamentals", "OS", "DBMS"],
      },
      {
        title: "Behavioral Interview Questions",
        type: "Guide",
        link: "https://www.themuse.com/advice/behavioral-interview-questions-answers-examples",
        categoryId: category.id,
        tags: ["HR", "Behavioral"],
      }
    ],
  });
  console.log("Created resources.");
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
