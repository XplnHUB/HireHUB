# HireHUB Backend — API Reference

Base URL: https://hirehub-backend-js0m.onrender.com

Common headers
- Content-Type: application/json
- Authorization: Bearer <token> (where required)

Note: This file lists the main route groups mounted in src/index.js. Each group typically exposes standard RESTful endpoints (list, create, read, update, delete) and some resource-specific actions.

---

## Root
- GET /  
  - Health / welcome message

## Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- POST /auth/forgot-password
- POST /auth/reset-password

## Students
Base: /students
- GET /students
- POST /students
- GET /students/:id
- PUT /students/:id
- PATCH /students/:id
- DELETE /students/:id
- (sub-resources often available) /students/:id/skills, /students/:id/coding-profiles, etc.

## Recruiters
Base: /recruiters
- GET /recruiters
- POST /recruiters
- GET /recruiters/:id
- PUT /recruiters/:id
- PATCH /recruiters/:id
- DELETE /recruiters/:id

## Jobs
Base: /jobs
- GET /jobs
- POST /jobs
- GET /jobs/:id
- PUT /jobs/:id
- PATCH /jobs/:id
- DELETE /jobs/:id
- GET /jobs?query=... (search/filter by skills, deadline, salary, recruiter)

## Applications
Base: /applications
- GET /applications
- POST /applications
- GET /applications/:id
- PUT /applications/:id
- PATCH /applications/:id (update status: applied, shortlisted, rejected, etc.)
- DELETE /applications/:id

## Interviews
Base: /interviews
- GET /interviews
- POST /interviews
- GET /interviews/:id
- PUT /interviews/:id
- PATCH /interviews/:id
- DELETE /interviews/:id

## Skills
Base: /skills
- GET /skills
- POST /skills
- GET /skills/:id
- PUT /skills/:id
- DELETE /skills/:id

## Coding Profiles
Base: /coding-profiles
- GET /coding-profiles
- POST /coding-profiles
- GET /coding-profiles/:id
- PUT /coding-profiles/:id
- DELETE /coding-profiles/:id

## Notifications
Base: /notifications
- GET /notifications
- POST /notifications
- GET /notifications/:id
- PATCH /notifications/:id (mark read/unread)
- DELETE /notifications/:id

## Integrations
Base: /integrations
- GET /integrations
- POST /integrations
- DELETE /integrations/:id
- (e.g., connect GitHub, LinkedIn, coding platforms)

## Search
Base: /api
- GET /api/search?query=...
- POST /api/search (advanced search payload)

## Dashboard
Base: /dashboard
- GET /dashboard (user-specific / aggregate stats)
- Other dashboards endpoints for recruiter/admin stats

## Application Tracking
Base: /application-tracking
- GET /application-tracking
- POST /application-tracking
- GET /application-tracking/:id
- PATCH /application-tracking/:id

## Resume
Base: /resume
- POST /resume/upload
- GET /resume/:id/download
- GET /resume/:id
- DELETE /resume/:id

## Notification Preferences
Base: /notification-preferences
- GET /notification-preferences
- POST /notification-preferences
- PATCH /notification-preferences/:id

## Calendar
Base: /calendar
- GET /calendar
- POST /calendar/events
- GET /calendar/events/:id
- PUT /calendar/events/:id
- DELETE /calendar/events/:id

## Admin
Base: /admin
- GET /admin/users
- GET /admin/stats
- POST /admin/actions (ban/unban, role changes)

## Advanced Search
Base: /advanced-search
- POST /advanced-search (complex filters across students/jobs)

## Interview Scheduling
Base: /interview-scheduling
- POST /interview-scheduling (propose/schedule)
- GET /interview-scheduling/:id
- PATCH /interview-scheduling/:id
- DELETE /interview-scheduling/:id

## Analytics
Base: /analytics
- GET /analytics (aggregate metrics, charts data)
- POST /analytics/custom

## Resources
Base: /resources
- GET /resources
- POST /resources
- GET /resources/:id
- PUT /resources/:id
- DELETE /resources/:id

## Resource Categories
Base: /resource-categories
- GET /resource-categories
- POST /resource-categories
- GET /resource-categories/:id
- PUT /resource-categories/:id
- DELETE /resource-categories/:id

---

Example curl
- List jobs:
  curl -H "Accept: application/json" "https://hirehub-backend-js0m.onrender.com/jobs"

- Create application (authenticated):
  curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
    -d '{"studentId":"<id>", "jobId":"<id>"}' \
    https://hirehub-backend-js0m.onrender.com/applications

---

If you want, I can:
- generate a Postman/OpenAPI spec for these routes,
- produce example request/response bodies for specific endpoints,
- or add required environment and auth details to this doc.
```// filepath: /Users/arpitsarang/Desktop/HireHUB/backend/Backend.md

# HireHUB Backend — API Reference

Base URL: https://hirehub-backend-js0m.onrender.com

Common headers
- Content-Type: application/json
- Authorization: Bearer <token> (where required)

Note: This file lists the main route groups mounted in src/index.js. Each group typically exposes standard RESTful endpoints (list, create, read, update, delete) and some resource-specific actions.

---

## Root
- GET /  
  - Health / welcome message

## Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- POST /auth/forgot-password
- POST /auth/reset-password

## Students
Base: /students
- GET /students
- POST /students
- GET /students/:id
- PUT /students/:id
- PATCH /students/:id
- DELETE /students/:id
- (sub-resources often available) /students/:id/skills, /students/:id/coding-profiles, etc.

## Recruiters
Base: /recruiters
- GET /recruiters
- POST /recruiters
- GET /recruiters/:id
- PUT /recruiters/:id
- PATCH /recruiters/:id
- DELETE /recruiters/:id

## Jobs
Base: /jobs
- GET /jobs
- POST /jobs
- GET /jobs/:id
- PUT /jobs/:id
- PATCH /jobs/:id
- DELETE /jobs/:id
- GET /jobs?query=... (search/filter by skills, deadline, salary, recruiter)

## Applications
Base: /applications
- GET /applications
- POST /applications
- GET /applications/:id
- PUT /applications/:id
- PATCH /applications/:id (update status: applied, shortlisted, rejected, etc.)
- DELETE /applications/:id

## Interviews
Base: /interviews
- GET /interviews
- POST /interviews
- GET /interviews/:id
- PUT /interviews/:id
- PATCH /interviews/:id
- DELETE /interviews/:id

## Skills
Base: /skills
- GET /skills
- POST /skills
- GET /skills/:id
- PUT /skills/:id
- DELETE /skills/:id

## Coding Profiles
Base: /coding-profiles
- GET /coding-profiles
- POST /coding-profiles
- GET /coding-profiles/:id
- PUT /coding-profiles/:id
- DELETE /coding-profiles/:id

## Notifications
Base: /notifications
- GET /notifications
- POST /notifications
- GET /notifications/:id
- PATCH /notifications/:id (mark read/unread)
- DELETE /notifications/:id

## Integrations
Base: /integrations
- GET /integrations
- POST /integrations
- DELETE /integrations/:id
- (e.g., connect GitHub, LinkedIn, coding platforms)

## Search
Base: /api
- GET /api/search?query=...
- POST /api/search (advanced search payload)

## Dashboard
Base: /dashboard
- GET /dashboard (user-specific / aggregate stats)
- Other dashboards endpoints for recruiter/admin stats

## Application Tracking
Base: /application-tracking
- GET /application-tracking
- POST /application-tracking
- GET /application-tracking/:id
- PATCH /application-tracking/:id

## Resume
Base: /resume
- POST /resume/upload
- GET /resume/:id/download
- GET /resume/:id
- DELETE /resume/:id

## Notification Preferences
Base: /notification-preferences
- GET /notification-preferences
- POST /notification-preferences
- PATCH /notification-preferences/:id

## Calendar
Base: /calendar
- GET /calendar
- POST /calendar/events
- GET /calendar/events/:id
- PUT /calendar/events/:id
- DELETE /calendar/events/:id

## Admin
Base: /admin
- GET /admin/users
- GET /admin/stats
- POST /admin/actions (ban/unban, role changes)

## Advanced Search
Base: /advanced-search
- POST /advanced-search (complex filters across students/jobs)

## Interview Scheduling
Base: /interview-scheduling
- POST /interview-scheduling (propose/schedule)
- GET /interview-scheduling/:id
- PATCH /interview-scheduling/:id
- DELETE /interview-scheduling/:id

## Analytics
Base: /analytics
- GET /analytics (aggregate metrics, charts data)
- POST /analytics/custom

## Resources
Base: /resources
- GET /resources
- POST /resources
- GET /resources/:id
- PUT /resources/:id
- DELETE /resources/:id

## Resource Categories
Base: /resource-categories
- GET /resource-categories
- POST /resource-categories
- GET /resource-categories/:id
- PUT /resource-categories/:id
- DELETE /resource-categories/:id

---

Example curl
- List jobs:
  curl -H "Accept: application/json" "https://hirehub-backend-js0m.onrender.com/jobs"

- Create application (authenticated):
  curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
    -d '{"studentId":"<id>", "jobId":"<id>"}' \
    https://hirehub-backend-js0m.onrender.com/applications

---

If you want, I can:
- generate a Postman/OpenAPI spec for these routes,
- produce example request/response bodies for specific endpoints,
- or add required environment and auth details to this doc.