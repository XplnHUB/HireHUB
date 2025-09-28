# HireHUB

## Overview
This Placement Portal is designed for college students and recruiters to streamline the placement process.  
It enables **students** to create auto-generated profiles from resumes, track job applications, and prepare using resources.  
It allows **recruiters** to post jobs, shortlist candidates, schedule interviews, and download analytics.  

The portal connects **students, recruiters, and administrators** in a single ecosystem.  

---

## Features

### Student Features
- **Registration & Profile Creation**
  - Sign up/login using email or SSO.
  - Upload resume → Auto extract academics, skills, achievements.
  - Integrations with external platforms:
    - GitHub (repos, contributions, stars).
    - LeetCode, Codeforces, CodeChef (ratings, problems solved).
    - LinkedIn profile linking.
- **Dashboard**
  - Personalized job recommendations.
  - Recent applied jobs & deadlines.
  - Notifications for shortlists, interviews, results.
- **Applications**
  - Apply directly to listed jobs.
  - Track application status (Applied → Shortlisted → Interview → Final Result).
  - Download interview schedules.
- **Resources**
  - Prep materials, sample interview questions.
  - Calendar sync for interview schedules.
  - Notifications via email + in-app.

---

### Recruiter Features
- **Registration & Profile Setup**
  - Company verification via admin approval.
  - Profile includes company logo, industry, website, offered roles.
- **Job Posting & Management**
  - Create job listings with eligibility, skills, package, deadline.
  - Edit/archive job postings.
- **Candidate Search & Filtering**
  - Filter students by CGPA, branch, skills, coding profiles.
  - Download resumes or bulk shortlist.
  - AI-powered candidate recommendations.
- **Application Tracking**
  - View student applications for each job.
  - Update status (Shortlist, Reject, Select).
  - Export candidate data.
- **Interview Management**
  - Schedule interviews (Google Meet / Zoom).
  - Notify candidates automatically.
  - Upload tests/assignments.
- **Reports & Insights**
  - Applicant analytics dashboard.
  - Selection ratios, skill heatmaps.
  - Exportable reports.

---

## Example Student Flow

1. Student visits portal → Registers/Login  
2. Uploads Resume → Auto profile created  
3. Dashboard shows personalized job recommendations  
4. Student applies to jobs → Status tracked in dashboard  
5. Shortlisted → Interview scheduled → Final result shown  
6. Student uses resources for preparation along the way  

---

## Example Recruiter Flow

1. Recruiter visits portal → Registers/Login  
2. Company profile verified by admin  
3. Recruiter posts a job with eligibility details  
4. Students apply → Recruiter views candidate list  
5. Recruiter shortlists candidates → Schedules interviews  
6. Interview results updated → Students notified  
7. Recruiter downloads analytics/reports for hiring process  

---

## Tech Notes (Future Scope)
- **Resume Parsing**: NLP/AI-based extraction (e.g., Pyresparser, OpenAI API).  
- **API Integrations**:
  - GitHub, LeetCode, Codeforces, CodeChef APIs.  
- **Notifications System**: Email (SMTP) + In-app push.  
- **Blockchain Verification**: Secure offer letters & certifications.  
- **AI Matching**: Rank students based on job description fit.  

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
        int graduation_year
        float cgpa
        string resume_url
        string github_profile
        string leetcode_profile
        string codeforces_profile
        string codechef_profile
        string linkedin_profile
        string interests
    }

    RECRUITER {
        int recruiter_id PK
        string name
        string email
        string password_hash
        string company_name
        string company_website
        string industry
        string role
        string logo_url
    }

    JOB {
        int job_id PK
        int recruiter_id FK
        string title
        string description
        string eligibility
        string skills_required
        float salary_package
        date application_deadline
        string status
    }

    APPLICATION {
        int application_id PK
        int job_id FK
        int student_id FK
        string status
        date applied_date
    }

    INTERVIEW {
        int interview_id PK
        int job_id FK
        int student_id FK
        date interview_date
        string mode
        string status
        string feedback
    }

    NOTIFICATION {
        int notification_id PK
        int student_id FK
        string message
        date created_at
        boolean is_read
    }

    STUDENT ||--o{ APPLICATION : applies
    JOB ||--o{ APPLICATION : has
    RECRUITER ||--o{ JOB : posts
    APPLICATION ||--o{ INTERVIEW : schedules
    STUDENT ||--o{ NOTIFICATION : receives
