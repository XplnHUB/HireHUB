import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, ChevronDown, CheckCircle, Loader } from 'lucide-react';
import JobCard from './JobCard';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const Jobs = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null);

    const [userLocation, setUserLocation] = useState('Set Location');

    useEffect(() => {
        fetchJobs();
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/students/profile');
            if (response.data && response.data.location) {
                setUserLocation(response.data.location);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        setApplying(jobId);
        try {
            await api.post('/applications', { jobId });
            toast.success('Application submitted successfully!');

            setJobs(prevJobs => prevJobs.map(job =>
                job.id === jobId ? { ...job, hasApplied: true } : job
            ));
        } catch (error) {
            console.error('Error applying for job:', error);
            toast.error(error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(null);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' ||
            (activeTab === 'recommended' && job.isRecommended) ||
            (activeTab === 'remote' && job.workType === 'Remote') ||
            (activeTab === 'internships' && job.type === 'Internship');
        return matchesSearch && matchesTab;
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
                    <h1 className="text-2xl font-bold text-secondary">Find Your Dream Job</h1>
                    <p className="text-slate-500">Browse through thousands of opportunities tailored for you</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <MapPin size={16} className="text-primary" />
                    <span>{userLocation}</span>
                    <ChevronDown size={14} className="ml-1 text-slate-400" />
                </div>
            </div>


            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by job title, company, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>
                <button className="px-6 py-3 bg-secondary text-white rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <Filter size={20} />
                    Filters
                </button>
            </div>


            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
                {['all', 'recommended', 'remote', 'internships'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${activeTab === tab
                            ? 'bg-primary text-white shadow-md shadow-orange-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary'
                            }`}
                    >
                        {tab === 'all' ? 'All Jobs' : tab}
                    </button>
                ))}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={{ ...job, isApplying: applying === job.id }}
                        onApply={handleApply}
                    />
                ))}
            </div>

            {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-secondary">No jobs found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default Jobs;
