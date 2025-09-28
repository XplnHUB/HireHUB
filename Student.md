# HireHUB – Student Side Documentation

This document outlines the features, pages, and workflow of the Placement Portal for students.  
The portal is designed to simplify campus placements by auto-creating profiles, offering job recommendations, and helping students track their placement journey.

---

## Student Webpage Workflow

### 1. Landing Page (Homepage)
- Welcome banner: "Find Your Dream Job on Campus"
- Call-to-Action: Register / Login
- Quick placement stats (companies, avg CTC, students placed)
- Featured recruiter logos carousel

---

### 2. Signup / Login
- Login using:
  - College Email
  - Google OAuth
- Role selection:
  - Student
- First-time login → Redirected to Resume Upload Page

---

### 3. Resume Upload & Profile Setup
- Upload Resume (PDF/DOCX)
- Auto-parsing system extracts:
  - Academic Info – Degree, Branch, Year, CGPA
  - Skills – Programming languages, tools, frameworks
  - Work Experience / Internships / Projects
  - Achievements – Certifications, hackathons
  - Profiles & Links – GitHub, LeetCode, LinkedIn, CodeChef, HackerRank
  - Interest Areas – e.g., AI, Web Dev, Cybersecurity
- Student can edit / add missing details manually

---

### 4. Student Dashboard
- Personalized profile card:
  - Name, Branch, CGPA
  - Resume snapshot
- Sections:
  - My Profile → Auto-filled + editable profile info
  - My Resume → Uploaded resume + update option
  - Coding Profiles → GitHub & LeetCode stats synced via APIs
  - Skill Graph → Visual skills chart (from resume + coding platforms)
  - Job Recommendations → Based on skills & eligibility
  - My Applications → Track job status
  - Upcoming Interviews → Date, time, and company info
  - Resources Section → Resume templates, aptitude prep, mock interviews

---

### 5. Job Listings
- Search & Filters:
  - Company, Role, CTC, Eligibility, Location
- Job Card includes:
  - Company Logo + Role
  - CTC + Location
  - Eligibility criteria
  - Deadline
  - Apply Button

---

### 6. Job Details
- Full Job Description
- Role & Responsibilities
- Salary / CTC breakdown
- Skills required
- Apply Now Button → Sends profile + resume

---

### 7. Application Tracking
- View all applications with statuses:
  - Applied → Shortlisted → Interview Scheduled → Offer → Selected / Rejected
- Notifications for each update

---

### 8. Interview & Placement Calendar
- Upcoming interview slots with companies
- Option to Confirm Availability
- Add to Google/Outlook calendar

---

### 9. Resources & Learning
- Aptitude practice tests
- Resume building guide
- Mock interview booking
- Placement FAQs

---

### 10. Notifications & Support
- Notifications:
  - New job posted  
  - Shortlisting / interview call  
  - Offer / rejection updates
- Delivery:  
  - Email  
  - In-app notifications
- Support Options:  
  - Helpdesk  
  - Chatbot for common queries  

---

## Student Features (At a Glance)

- Resume Upload → Auto Profile Creation
- Auto Academic & Skills Extraction
- Coding Platform Integrations (GitHub, LeetCode, Codeforces, HackerRank, etc.)
- Skill & Interest Area Mapping
- Job Search & Smart Recommendations
- Application Tracking with Status Updates
- Interview Scheduler & Calendar Sync
- Placement Resources (Guides, Tests, Mock Interviews)
- Real-time Notifications (Email + Portal)
- Support System (Chatbot + Helpdesk)

---

## Example Student Flow

1. Student visits portal → Registers/Login  
2. Uploads Resume → Auto profile created  
3. Dashboard shows personalized job recommendations  
4. Student applies to jobs → Status tracked in dashboard  
5. Shortlisted → Interview scheduled → Final result shown  
6. Student uses resources for preparation along the way  

---

## Tech Notes (Future Scope for Students)

- Resume Parsing → NLP/AI-based extraction (e.g., Pyresparser, OpenAI API)  
- API Integrations for coding platforms:  
  - GitHub API (repos, contributions, stars)  
  - LeetCode API (contest rating, problems solved)  
  - CodeChef/Codeforces APIs  
- Calendar Integration → Google/Outlook sync  
- Notifications System → Email (SMTP) + In-app  

---

# DATABASE SCHEMA

```mermaid
erDiagram

    STUDENT {
        int student_id PK
        string name
        string email
        string password_hash
        string branch
        int year
        float cgpa
        string resume_url
        string interest_areas
        datetime created_at
    }

    SKILL {
        int skill_id PK
        string name
    }

    STUDENT_SKILL {
        int student_id FK
        int skill_id FK
    }

    CODING_PROFILE {
        int profile_id PK
        int student_id FK
        string platform_name
        string username
        string profile_url
        int rating
        int problems_solved
    }

    JOB {
        int job_id PK
        string company_name
        string role
        string location
        float ctc
        string eligibility
        string description
        datetime deadline
    }

    APPLICATION {
        int application_id PK
        int student_id FK
        int job_id FK
        string status
        datetime applied_at
    }

    INTERVIEW {
        int interview_id PK
        int application_id FK
        datetime interview_date
        string mode
        string location_or_link
        string status
    }

    RESOURCE {
        int resource_id PK
        string title
        string type
        string link
    }

    NOTIFICATION {
        int notification_id PK
        int student_id FK
        string message
        boolean is_read
        datetime created_at
    }

    STUDENT ||--o{ STUDENT_SKILL : has
    SKILL ||--o{ STUDENT_SKILL : assigned

    STUDENT ||--o{ CODING_PROFILE : owns
    STUDENT ||--o{ APPLICATION : submits
    JOB ||--o{ APPLICATION : receives

    APPLICATION ||--o{ INTERVIEW : scheduled
    STUDENT ||--o{ NOTIFICATION : receives
