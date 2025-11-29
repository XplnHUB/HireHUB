import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Auth from './components/Auth';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import Profile from './components/dashboard/Profile';
import Jobs from './components/dashboard/Jobs';
import Settings from './components/dashboard/Settings';
import RecruiterLayout from './components/recruiter/RecruiterLayout';
import RecruiterDashboard from './components/recruiter/RecruiterDashboard';
import JobManager from './components/recruiter/JobManager';
import CreateJob from './components/recruiter/CreateJob';
import CandidatePipeline from './components/recruiter/CandidatePipeline';
import InterviewCalendar from './components/recruiter/InterviewCalendar';
import RecruiterAnalytics from './components/recruiter/RecruiterAnalytics';
import CompanyProfile from './components/recruiter/CompanyProfile';
import RecruiterSettings from './components/recruiter/RecruiterSettings';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const LandingPage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
    </main>
    <Footer />
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans text-slate-800">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Page */}
            <Route path="/auth" element={<Auth />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute allowedRoles={['student']}>
                <DashboardLayout />
              </PrivateRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<Profile />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Recruiter Routes */}
            <Route path="/recruiter" element={
              <PrivateRoute allowedRoles={['recruiter']}>
                <RecruiterLayout />
              </PrivateRoute>
            }>
              <Route index element={<RecruiterDashboard />} />
              <Route path="jobs" element={<JobManager />} />
              <Route path="jobs/create" element={<CreateJob />} />
              <Route path="jobs/:id/edit" element={<CreateJob />} />
              <Route path="candidates" element={<CandidatePipeline />} />
              <Route path="interviews" element={<InterviewCalendar />} />
              <Route path="analytics" element={<RecruiterAnalytics />} />
              <Route path="company" element={<CompanyProfile />} />
              <Route path="settings" element={<RecruiterSettings />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
