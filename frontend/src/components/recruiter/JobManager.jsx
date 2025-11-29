import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, Users, Clock, CheckCircle, Briefcase, Loader } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const JobManager = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('active');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalCandidates: 0,
        hired: 0
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    // Refresh jobs when returning from create page
    useEffect(() => {
        if (location.state?.refresh) {
            fetchJobs();
            // Clear the state to prevent re-fetching on subsequent renders
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const fetchJobs = async () => {
        try {
            const [jobsRes, statsRes] = await Promise.all([
                api.get('/recruiters/jobs'),
                api.get('/recruiters/stats')
            ]);
            setJobs(jobsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            // toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await api.delete(`/jobs/${jobId}`);
                setJobs(prev => prev.filter(job => job.id !== jobId));
                toast.success('Job deleted successfully');
            } catch (error) {
                console.error('Error deleting job:', error);
                toast.error('Failed to delete job');
            }
        }
    };

    const filteredJobs = jobs.filter(job => {
        if (activeTab === 'active') return job.status === 'Active';
        if (activeTab === 'closed') return job.status === 'Closed';
        if (activeTab === 'drafts') return job.status === 'Draft';
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Job Postings</h1>
                    <p className="text-slate-500">Manage your open positions and track applications</p>
                </div>
                <Link
                    to="/recruiter/jobs/create"
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                    <Plus size={20} /> Post New Job
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Briefcase size={20} />
                        </div>
                        <span className="text-2xl font-bold text-secondary">{stats.activeJobs}</span>
                    </div>
                    <p className="text-slate-500 font-medium">Active Jobs</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Users size={20} />
                        </div>
                        <span className="text-2xl font-bold text-secondary">{stats.totalCandidates}</span>
                    </div>
                    <p className="text-slate-500 font-medium">Total Candidates</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-2xl font-bold text-secondary">{stats.hired}</span>
                    </div>
                    <p className="text-slate-500 font-medium">Hired This Month</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                        {['active', 'closed', 'drafts'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                {tab} Jobs
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 bg-white">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold">
                                <th className="px-6 py-4">Job Title</th>
                                <th className="px-6 py-4">Applicants</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Posted</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.length > 0 ? filteredJobs.map(job => (
                                <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <h3 className="font-bold text-secondary">{job.title}</h3>
                                            <p className="text-sm text-slate-500">{job.department} • {job.type} • {job.location}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-slate-400" />
                                            <span className="font-medium text-secondary">{job.applicants}</span>
                                            {job.newApplicants > 0 && (
                                                <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+{job.newApplicants} new</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${job.status === 'Active'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Clock size={16} />
                                            <span>{job.posted}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/recruiter/jobs/${job.id}`}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-orange-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                to={`/recruiter/jobs/${job.id}/edit`}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(job.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        No jobs found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default JobManager;
