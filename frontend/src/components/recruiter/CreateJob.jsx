import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const CreateJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetchingJob, setFetchingJob] = useState(false);
    const isEditMode = Boolean(id);

    const [jobData, setJobData] = useState({
        title: '',
        department: '',
        type: 'Full-time',
        workMode: 'Remote',
        location: '',
        salaryMin: '',
        salaryMax: '',
        currency: 'USD',
        description: '',
        requirements: '',
        skills: [],
        openings: 1,
        deadline: ''
    });

    const [skillInput, setSkillInput] = useState('');


    useEffect(() => {
        if (isEditMode) {
            fetchJobData();
        }
    }, [id]);

    const fetchJobData = async () => {
        setFetchingJob(true);
        try {
            const response = await api.get(`/jobs/${id}`);
            const job = response.data;


            setJobData({
                title: job.title || '',
                department: job.department || '',
                type: job.type || 'Full-time',
                workMode: job.isRemote ? 'Remote' : 'Onsite',
                location: job.location || '',
                salaryMin: '',
                salaryMax: job.salaryPackage || '',
                currency: 'USD',
                description: job.description || '',
                requirements: job.eligibility || '',
                skills: job.skillsRequired ? job.skillsRequired.split(', ').filter(s => s) : [],
                openings: 1,
                deadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : ''
            });
        } catch (error) {
            console.error('Error fetching job:', error);
            toast.error('Failed to load job data');
            navigate('/recruiter/jobs');
        } finally {
            setFetchingJob(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!jobData.skills.includes(skillInput.trim())) {
                setJobData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
            }
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setJobData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: jobData.title,
                description: jobData.description,
                eligibility: jobData.requirements || 'Open to all',
                skillsRequired: jobData.skills.join(', '),
                salaryPackage: jobData.salaryMax ? parseFloat(jobData.salaryMax) : null,
                applicationDeadline: jobData.deadline ? new Date(jobData.deadline) : null,
                status: 'open',
                isRemote: jobData.workMode === 'Remote'
            };

            if (isEditMode) {
                await api.put(`/jobs/${id}`, payload);
                toast.success('Job updated successfully!');
            } else {
                await api.post('/jobs', payload);
                toast.success('Job posted successfully!');
            }

            navigate('/recruiter/jobs', { state: { refresh: true } });
        } catch (error) {
            console.error('Error saving job:', error);
            toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} job`);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingJob) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading job data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <button
                onClick={() => navigate('/recruiter/jobs')}
                className="flex items-center gap-2 text-slate-500 hover:text-secondary mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Jobs
            </button>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-secondary">
                    {isEditMode ? 'Edit Job' : 'Post a New Job'}
                </h1>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                        Save Draft
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70 font-medium"
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Update Job' : 'Publish Job')}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 lg:p-8">
                <form className="space-y-8">

                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-secondary border-b border-slate-100 pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={jobData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g. Senior Frontend Engineer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={jobData.department}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g. Engineering"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={jobData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g. San Francisco, CA"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                                <select
                                    name="type"
                                    value={jobData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Work Mode</label>
                                <select
                                    name="workMode"
                                    value={jobData.workMode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                                >
                                    <option>Remote</option>
                                    <option>Onsite</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-secondary border-b border-slate-100 pb-2">Compensation & Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Min Salary</label>
                                <input
                                    type="number"
                                    name="salaryMin"
                                    value={jobData.salaryMin}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="50000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Max Salary</label>
                                <input
                                    type="number"
                                    name="salaryMax"
                                    value={jobData.salaryMax}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="80000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Openings</label>
                                <input
                                    type="number"
                                    name="openings"
                                    value={jobData.openings}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="1"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-secondary border-b border-slate-100 pb-2">Description & Requirements</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills</label>
                            <div className="flex flex-wrap gap-2 mb-2 p-2 border border-slate-200 rounded-lg min-h-[48px]">
                                {jobData.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-orange-700">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={addSkill}
                                    className="flex-1 outline-none bg-transparent min-w-[120px]"
                                    placeholder="Type skill and press Enter..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
                            <textarea
                                name="description"
                                value={jobData.description}
                                onChange={handleInputChange}
                                rows="6"
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                placeholder="Describe the role, responsibilities, and what you're looking for..."
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;
