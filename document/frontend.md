# HireHUB Frontend Requirements

## Overview

This document outlines the frontend requirements for HireHUB, an intelligent placement management system connecting students, recruiters, and college administrators. The frontend should be professional, visually appealing, and user-friendly, reflecting modern design principles while delivering a smooth user experience.

---

## 1. Design System

### 1.1 Color Palette

- **Primary Colors**
  - Primary: `#2563EB` (Royal Blue) - For primary actions, buttons, and key UI elements
  - Secondary: `#10B981` (Emerald Green) - For success states and secondary actions
  - Accent: `#8B5CF6` (Purple) - For highlighting important elements

- **Neutral Colors**
  - Background: `#F9FAFB` (Light Gray)
  - Surface: `#FFFFFF` (White)
  - Text Primary: `#111827` (Near Black)
  - Text Secondary: `#6B7280` (Medium Gray)
  - Border: `#E5E7EB` (Light Gray)

- **Semantic Colors**
  - Success: `#10B981` (Green)
  - Warning: `#F59E0B` (Amber)
  - Error: `#EF4444` (Red)
  - Info: `#3B82F6` (Blue)

### 1.2 Typography

- **Font Families**
  - Primary: Inter (Sans-serif)
  - Secondary: Poppins (Headers and emphasis)
  - Monospace: JetBrains Mono (For code snippets or technical content)

- **Font Sizes**
  - Base: 16px
  - Scale: 1.25 ratio
  - Heading 1: 2.5rem (40px)
  - Heading 2: 2rem (32px)
  - Heading 3: 1.5rem (24px)
  - Heading 4: 1.25rem (20px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)
  - XSmall: 0.75rem (12px)

- **Font Weights**
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700

### 1.3 Spacing

- **Base Unit**: 4px
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px
- **Component Spacing**: Consistent padding and margins based on the scale

### 1.4 Shadows & Elevation

- **Shadow Levels**
  - Level 1: `0 1px 3px rgba(0,0,0,0.1)`
  - Level 2: `0 4px 6px rgba(0,0,0,0.1)`
  - Level 3: `0 10px 15px rgba(0,0,0,0.1)`
  - Level 4: `0 20px 25px rgba(0,0,0,0.1)`

### 1.5 Border Radius

- **Small**: 4px (Form inputs, tags)
- **Medium**: 8px (Cards, buttons)
- **Large**: 12px (Modal dialogs)
- **XLarge**: 16px (Floating panels)
- **Full**: 9999px (Pills, avatars)

---

## 2. Layout Structure

### 2.1 Global Layout

- **Navigation**
  - Top navigation bar with logo, search, notifications, and user profile
  - Sidebar navigation for main sections (collapsible on mobile)
  - Breadcrumbs for deep navigation paths

- **Page Structure**
  - Header section with page title and primary actions
  - Main content area with appropriate padding
  - Footer with links to resources, help, and legal information

### 2.2 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px - 1279px
- **Large Desktop**: ≥ 1280px

### 2.3 Grid System

- 12-column grid system for layout flexibility
- Consistent gutters (16px on mobile, 24px on desktop)
- Container max-width: 1280px for large screens

### 2.4 Page Templates

1. **Dashboard Template**
   - Header with user welcome and quick stats
   - Multiple card sections for different data categories
   - Sidebar with navigation and quick actions

2. **List View Template**
   - Filter panel (collapsible on mobile)
   - Data table/list with pagination
   - Bulk action toolbar

3. **Detail View Template**
   - Header with breadcrumbs and actions
   - Main content with tabs for different sections
   - Related information sidebar

4. **Form Template**
   - Multi-step forms with progress indicator
   - Validation feedback
   - Action buttons consistently positioned

5. **Landing Page Template**
   - Hero section with call-to-action
   - Feature highlights
   - Testimonials and statistics
   - FAQ section

---

## 3. UI Components

### 3.1 Navigation Components

- **Top Navigation Bar**
  - Logo/brand
  - Primary navigation links
  - Search bar
  - Notification bell with counter
  - User profile dropdown

- **Sidebar Navigation**
  - User profile summary
  - Main navigation links with icons
  - Collapsible sections
  - Quick action buttons

- **Breadcrumbs**
  - Show navigation path
  - Clickable previous levels

### 3.2 Data Display Components

- **Dashboard Cards**
  - Title with optional icon
  - Primary metric with trend indicator
  - Secondary metrics or chart
  - Action link

- **Data Tables**
  - Sortable columns
  - Filterable data
  - Pagination
  - Row selection
  - Bulk actions
  - Responsive behavior (horizontal scroll on mobile)

- **Charts & Visualizations**
  - Line charts for trends
  - Bar charts for comparisons
  - Pie/donut charts for distributions
  - Interactive tooltips
  - Responsive sizing

- **Timeline**
  - Visual representation of application/interview process
  - Status indicators
  - Date information
  - Action buttons at each stage

### 3.3 Input & Form Components

- **Text Inputs**
  - Labels
  - Placeholder text
  - Validation states
  - Helper text
  - Error messages

- **Selection Controls**
  - Dropdowns with search
  - Multi-select with tags
  - Radio buttons
  - Checkboxes
  - Toggle switches

- **Date & Time Pickers**
  - Calendar view
  - Time selection
  - Range selection

- **File Upload**
  - Drag and drop area
  - File type validation
  - Progress indicator
  - Preview capability

- **Form Layout**
  - Logical grouping of fields
  - Responsive column layout
  - Consistent spacing
  - Clear section headings

### 3.4 Feedback Components

- **Notifications**
  - Toast messages (success, error, info)
  - Notification center with history
  - Read/unread states

- **Modals & Dialogs**
  - Confirmation dialogs
  - Form dialogs
  - Information dialogs
  - Consistent action button positioning

- **Progress Indicators**
  - Linear progress bars
  - Circular spinners
  - Skeleton loaders for content
  - Step indicators for multi-step processes

- **Empty States**
  - Helpful illustrations
  - Clear messaging
  - Action buttons

### 3.5 Special Components

- **Profile Cards**
  - User photo/avatar
  - Key information
  - Action buttons
  - Status indicators

- **Job Cards**
  - Company logo
  - Job title and company
  - Key details (location, salary, deadline)
  - Quick apply button
  - Save/bookmark option

- **Calendar Integration**
  - Month/week/day views
  - Event creation
  - Google Calendar sync UI

- **Resume Parser UI**
  - Upload area
  - Parsing progress
  - Extracted information review
  - Edit capabilities

---

## 4. Frameworks, Libraries & Dependencies

### 4.1 Core Framework

- **Next.js** (v13+)
  - App Router for routing
  - Server Components for improved performance
  - API routes for backend communication

### 4.2 UI Framework

- **React** (v18+)
  - Functional components with hooks
  - Context API for state management
  - Error boundaries for resilience

### 4.3 Styling

- **Tailwind CSS**
  - Custom theme configuration
  - Component classes
  - Responsive utilities
  - Dark mode support

- **CSS Modules** or **Styled Components**
  - For complex component styling beyond Tailwind

### 4.4 State Management

- **React Query** / **TanStack Query**
  - Data fetching and caching
  - Mutation handling
  - Pagination support

- **Zustand** or **Redux Toolkit**
  - For complex global state management
  - Persistent state with local storage

### 4.5 Form Handling

- **React Hook Form**
  - Form validation
  - Error handling
  - Performance optimization

- **Zod** or **Yup**
  - Schema validation
  - Type safety

### 4.6 UI Component Libraries

- **Shadcn/UI**
  - Accessible components
  - Customizable design
  - Headless approach

- **Radix UI**
  - Accessible primitives
  - Composition-based components

### 4.7 Data Visualization

- **Chart.js** or **D3.js**
  - For analytics dashboards
  - Interactive charts
  - Responsive visualizations

### 4.8 Date & Time

- **date-fns**
  - Date formatting
  - Date calculations
  - Timezone handling

### 4.9 Authentication

- **NextAuth.js**
  - OAuth providers (Google, GitHub)
  - JWT handling
  - Session management

### 4.10 Additional Libraries

- **React-PDF** for resume viewing
- **React-DnD** for drag-and-drop interfaces
- **Framer Motion** for animations
- **React-Table** for advanced table features
- **React-Hook-Form** for form management
- **React-Calendar** for calendar interfaces

---

## 5. Responsive Behavior

### 5.1 Mobile-First Approach

- Design for mobile screens first, then enhance for larger screens
- Use responsive units (rem, %, vh/vw) instead of fixed pixels
- Test on various device sizes and orientations

### 5.2 Component Adaptations

- **Navigation**: Sidebar collapses to bottom navigation or hamburger menu
- **Tables**: Horizontal scroll or card view on small screens
- **Forms**: Single column layout on mobile, multi-column on desktop
- **Modals**: Full screen on mobile, centered with padding on desktop

### 5.3 Touch Optimization

- Minimum touch target size: 44x44px
- Sufficient spacing between interactive elements
- Swipe gestures for common actions
- Pull-to-refresh for data updates

### 5.4 Performance Considerations

- Lazy load images and heavy components
- Optimize for low bandwidth conditions
- Implement skeleton loaders for perceived performance
- Consider reduced motion preferences

---

## 6. Accessibility Guidelines

### 6.1 WCAG Compliance

- Target WCAG 2.1 AA compliance level
- Regular accessibility audits using tools like Lighthouse

### 6.2 Keyboard Navigation

- All interactive elements must be keyboard accessible
- Visible focus indicators
- Logical tab order
- Keyboard shortcuts for power users

### 6.3 Screen Reader Support

- Semantic HTML structure
- ARIA attributes where necessary
- Alternative text for images
- Descriptive link text

### 6.4 Color & Contrast

- Minimum contrast ratio of 4.5:1 for normal text
- Don't rely solely on color to convey information
- Support high contrast mode

### 6.5 Form Accessibility

- Associated labels for all form controls
- Clear error messages
- Grouped related fields with fieldsets
- Descriptive button text

---

## 7. Best Practices

### 7.1 Code Structure

- Component-based architecture
- Atomic design principles
- Clear separation of concerns
- Consistent naming conventions

### 7.2 Performance Optimization

- Code splitting and lazy loading
- Image optimization
- Efficient re-rendering strategies
- Memoization for expensive calculations

### 7.3 Testing Strategy

- Unit tests for components and utilities
- Integration tests for user flows
- End-to-end tests for critical paths
- Visual regression testing

### 7.4 Documentation

- Component documentation with Storybook
- JSDoc comments for functions and components
- README files for key directories
- Design system documentation

### 7.5 Maintainability

- Consistent code formatting with Prettier
- Linting with ESLint
- Type safety with TypeScript
- Regular dependency updates

---

## 8. User Flows

### 8.1 Student User Flows

1. **Registration & Onboarding**
   - Sign up form with email or SSO
   - Resume upload and parsing
   - Profile completion steps
   - Integration connections (GitHub, LeetCode, etc.)

2. **Job Discovery & Application**
   - Browse job listings with filters
   - View job details
   - Apply with profile/resume
   - Track application status

3. **Interview Preparation**
   - View scheduled interviews
   - Access preparation resources
   - Calendar integration
   - Notification management

### 8.2 Recruiter User Flows

1. **Company Registration & Verification**
   - Sign up and company details
   - Document upload for verification
   - Profile completion

2. **Job Posting & Management**
   - Create job listing form
   - Edit and manage postings
   - Close or archive positions

3. **Candidate Evaluation**
   - Browse applications
   - Filter and search candidates
   - Shortlist and schedule interviews
   - Update application statuses

4. **Analytics & Reporting**
   - View dashboards
   - Generate reports
   - Export data

### 8.3 Admin User Flows

1. **Company Verification**
   - Review verification requests
   - Approve or reject companies
   - Manage verification status

2. **Platform Management**
   - User management
   - Resource management
   - System settings

---

## 9. Implementation Priorities

### 9.1 Phase 1: Core Infrastructure

- Design system implementation
- Authentication system
- Basic layout components
- Responsive framework

### 9.2 Phase 2: Student Features

- Profile management
- Resume parsing interface
- Job browsing and application
- Application tracking

### 9.3 Phase 3: Recruiter Features

- Company profile management
- Job posting interface
- Candidate management
- Interview scheduling

### 9.4 Phase 4: Advanced Features

- Analytics dashboards
- Resource management
- Notification system
- Calendar integration

---

## 10. Quality Assurance

### 10.1 Cross-Browser Testing

- Chrome, Firefox, Safari, Edge
- Mobile browsers (Chrome for Android, Safari for iOS)

### 10.2 Device Testing

- Desktop (various screen sizes)
- Tablets (iPad, Android tablets)
- Mobile phones (iPhone, Android phones)

### 10.3 Performance Benchmarks

- First Contentful Paint < 1.8s
- Time to Interactive < 3.5s
- Lighthouse Performance score > 90
- Bundle size < 300KB (initial load)

### 10.4 Accessibility Verification

- Automated testing with axe-core
- Manual testing with screen readers
- Keyboard navigation testing

---

## 11. Project Tasks & Status

### 11.1 Implemented (Design + Features)

- [x] Design system (colors, fonts, radii, shadows) configured in Tailwind; headings sized per spec; no `@apply` usage in globals.css
- [x] Global layout: Header, Footer, MainLayout; responsive Sidebar; Dashboard top bar with search
- [x] Breadcrumbs and PageHeader components added and integrated into dashboard pages
- [x] Landing page and authentication UIs (login/register)
- [x] Student Dashboard sections: stats cards, upcoming interviews, recent applications, profile completion, recommended jobs
- [x] UI components: TextInput, Select, MultiSelect, Checkbox, Radio, ToggleSwitch, Modal, Toasts (provider + hook), ProgressBar, Spinner, Skeleton, Stepper, Pagination
- [x] Data components: DashboardCard, DataTable (search/sort/pagination/selection), Timeline
- [x] Charts: LineChart, BarChart, PieChart (lightweight SVG)
- [x] Special components: ProfileCard, JobCard, Calendar (Month view), Resume Parser UI (upload → mock parse → editable fields)

### 11.2 Pending (Backend Integration + Features)

- [ ] Environment + CORS alignment (backend `PORT=4000`, `FRONTEND_URL=http://localhost:3000`; frontend `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`)
- [ ] API client wrapper (base URL, auth token, JSON/error handling, optional retry)
- [ ] React Query setup (query client provider, cache keys, mutations, optimistic updates)
- [ ] Auth integration to `/auth` (login/register/logout), secure token storage, route guards (middleware) for `/dashboard/*`
- [ ] Dashboard metrics from `/dashboard` + charts from `/analytics`
- [ ] Jobs list wired to `/jobs` with filters/search/pagination/bulk actions using DataTable
- [ ] Applications list wired to `/applications` (sorting/filtering/bulk)
- [ ] Interviews wired to `/interviews` and `/interview-scheduling` (accept/reschedule/cancel)
- [ ] Notifications: fetch `/notifications`, mark read/unread, badge counter; preferences via `/notification-preferences`
- [ ] Student profile CRUD via `/students` and profile completion calculation
- [ ] Resources center wired to `/resources` and `/resource-categories`
- [ ] Calendar events CRUD via `/calendar` (feeds Calendar component)
- [ ] Resume Parser: POST to `/resume`, map parsed payload to editable form
- [ ] Unified Search UI integrating `/api` and `/advanced-search` (results in DataTable)
- [ ] Recruiter area wired to `/recruiters`, `/jobs`, `/interviews`
- [ ] Admin area wired to `/admin`, `/students`, `/recruiters`, `/jobs`, `/analytics`
- [ ] Route-level loading and error boundaries (`loading.tsx`, `error.tsx`) per page group
- [ ] Accessibility pass (landmarks, aria, keyboard, focus rings, contrast)
- [ ] Performance/Lighthouse (>90): code-splitting, image optimization, prefetching
- [ ] Cross-browser/device QA (Chrome, Firefox, Safari, Edge; iOS/Android)
- [ ] Tailwind v4 hardening (optionally switch to `@import "tailwindcss"` in globals.css)

### 11.3 Frontend ↔ Backend Integration Plan

- **Environment**
  - Backend: `PORT=4000`, `FRONTEND_URL=http://localhost:3000`
  - Frontend: `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`
- **API client**
  - Small wrapper around `fetch`/axios with base URL, `Authorization` header, JSON parsing, normalized errors
- **State/data**
  - React Query for queries/mutations, pagination and caching
- **Auth**
  - Forms post to `/auth`; store session (prefer httpOnly cookie via backend or bearer + refresh); protect `/dashboard/*` via middleware
- **UX resilience**
  - loading/error boundaries, toasts, skeletons; optimistic updates where sensible
- **Security**
  - CORS aligned to `FRONTEND_URL`; rate limits already applied in backend

### 11.4 Endpoint Mapping (from backend/src/index.js)

- Auth: `/auth`
- Students: `/students`
- Recruiters: `/recruiters`
- Jobs: `/jobs`
- Applications: `/applications`
- Interviews: `/interviews`, `/interview-scheduling`
- Skills: `/skills` | Coding Profiles: `/coding-profiles`
- Notifications: `/notifications` | Preferences: `/notification-preferences`
- Integrations: `/integrations`
- Search: `/api`, `/advanced-search`
- Dashboard: `/dashboard`
- Application Tracking: `/application-tracking`
- Resume: `/resume`
- Calendar: `/calendar`
- Admin: `/admin`
- Analytics: `/analytics`
- Resources: `/resources`, `/resource-categories`

### 11.5 Next Steps

1. Configure envs and ports (backend 4000, frontend API base URL)
2. Add API client + React Query provider
3. Wire auth forms to `/auth` and add route guards
4. Integrate Jobs and Applications pages first using DataTable
5. Hook dashboard metrics (dashboard/analytics), then notifications and calendar

This document serves as a comprehensive guide for frontend development of the HireHUB platform. It should be reviewed and updated regularly as the project evolves.
