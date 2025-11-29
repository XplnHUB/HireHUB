import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, Clock, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalApplications: 0,
        interviewsScheduled: 0,
        pendingReviews: 0,
        offersReceived: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, activityRes, interviewsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/dashboard/activity'),
                api.get('/dashboard/interviews')
            ]);

            // Backend returns {success, data} structure for stats
            const statsData = statsRes.data.data || statsRes.data;
            setStats({
                totalApplications: statsData.applications?.total || 0,
                interviewsScheduled: statsData.interviews?.upcoming || 0,
                pendingReviews: statsData.applications?.shortlisted || 0,
                offersReceived: statsData.applications?.offered || 0
            });
            setRecentActivity(activityRes.data || []);
            setUpcomingInterviews(interviewsRes.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Applications', value: stats.totalApplications, icon: Briefcase, color: 'blue' },
        { label: 'Interviews Scheduled', value: stats.interviewsScheduled, icon: Calendar, color: 'purple' },
        { label: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, color: 'orange' },
        { label: 'Offers Received', value: stats.offersReceived, icon: CheckCircle, color: 'green' },
    ];

    if (loading) {
        return <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
            </div>
        </div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-secondary to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
                    <p className="text-slate-300 max-w-xl">
                        You have <span className="text-primary font-bold">{stats.interviewsScheduled} upcoming interviews</span> and <span className="text-accent font-bold">{stats.pendingReviews} pending applications</span>. Keep up the great work!
                    </p>
                    <div className="mt-6 flex gap-4">
                        <Link to="/dashboard/jobs" className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/25">
                            Find Jobs
                        </Link>
                        <Link to="/dashboard/profile" className="px-6 py-2.5 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-colors backdrop-blur-sm">
                            Update Profile
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-secondary mb-1">{stat.value}</h3>
                            <p className="text-slate-500 font-medium">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-secondary">Recent Activity</h2>
                        <button className="text-primary text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center z-10 relative">
                                        <Briefcase size={18} className="text-slate-500" />
                                    </div>
                                    {index !== recentActivity.length - 1 && (
                                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-100 -z-0"></div>
                                    )}
                                </div>
                                <div className="flex-1 pt-1">
                                    <h4 className="font-bold text-secondary text-sm">{activity.title}</h4>
                                    <p className="text-slate-500 text-sm mt-1">{activity.description}</p>
                                    <span className="text-xs text-slate-400 mt-2 block">{activity.time}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-4">No recent activity</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Interviews */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-secondary">Upcoming Interviews</h2>
                        <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <Calendar size={20} className="text-slate-400" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {upcomingInterviews.length > 0 ? upcomingInterviews.map((interview, index) => (
                            <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-lg font-bold text-secondary">
                                        {interview.day}
                                    </div>
                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                                        {interview.time}
                                    </span>
                                </div>
                                <h4 className="font-bold text-secondary mb-1 group-hover:text-primary transition-colors">
                                    {interview.company}
                                </h4>
                                <p className="text-sm text-slate-500 mb-3">{interview.role}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    {interview.type}
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-4">No upcoming interviews</p>
                        )}
                    </div>
                    <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                        View Calendar <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
