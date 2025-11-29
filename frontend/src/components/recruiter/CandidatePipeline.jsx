import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, ArrowRight, Loader } from 'lucide-react';
import CandidateCard from './CandidateCard';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const CandidatePipeline = () => {
    const [activeJob, setActiveJob] = useState('all');
    const [candidates, setCandidates] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPipelineData();
    }, []);

    const fetchPipelineData = async () => {
        try {
            const [candidatesRes, jobsRes] = await Promise.all([
                api.get('/recruiters/candidates'),
                api.get('/recruiters/jobs')
            ]);
            setCandidates(candidatesRes.data);
            setJobs(jobsRes.data);
        } catch (error) {
            console.error('Error fetching pipeline data:', error);
            // toast.error('Failed to load candidates');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (candidateId, newStatus) => {
        try {
            await api.patch(`/applications/${candidateId}/status`, { status: newStatus });
            setCandidates(prev => prev.map(c =>
                c.id === candidateId ? { ...c, stage: newStatus } : c
            ));
            toast.success('Candidate status updated');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const stages = [
        { id: 'applied', title: 'Applied', color: 'bg-blue-500' },
        { id: 'shortlisted', title: 'Shortlisted', color: 'bg-purple-500' },
        { id: 'interview', title: 'Interview', color: 'bg-orange-500' },
        { id: 'hired', title: 'Hired', color: 'bg-green-500' },
        { id: 'rejected', title: 'Rejected', color: 'bg-red-500' }
    ];

    const filteredCandidates = candidates.filter(c =>
        activeJob === 'all' || c.jobId === activeJob
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Candidate Pipeline</h1>
                    <p className="text-slate-500">Manage applications and track candidate progress</p>
                </div>

                <div className="flex gap-3">
                    <select
                        className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-primary outline-none text-sm font-medium text-secondary"
                        value={activeJob}
                        onChange={(e) => setActiveJob(e.target.value)}
                    >
                        <option value="all">All Jobs</option>
                        {jobs.map(job => (
                            <option key={job.id} value={job.id}>{job.title}</option>
                        ))}
                    </select>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            className="pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-64"
                        />
                    </div>

                    <button className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 bg-white">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Pipeline Board */}
            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 min-w-max h-full px-1">
                    {stages.map(stage => (
                        <div key={stage.id} className="w-80 flex flex-col bg-slate-50 rounded-xl border border-slate-100 h-full">
                            {/* Column Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-xl">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                                    <h3 className="font-bold text-secondary text-sm">{stage.title}</h3>
                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                        {filteredCandidates.filter(c => c.stage === stage.id).length}
                                    </span>
                                </div>
                                <button className="text-slate-400 hover:text-secondary">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>

                            {/* Cards Container */}
                            <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                                {filteredCandidates
                                    .filter(c => c.stage === stage.id)
                                    .map(candidate => (
                                        <CandidateCard
                                            key={candidate.id}
                                            candidate={candidate}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))}

                                {filteredCandidates.filter(c => c.stage === stage.id).length === 0 && (
                                    <div className="h-32 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg m-2">
                                        <span className="text-sm">No candidates</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CandidatePipeline;
