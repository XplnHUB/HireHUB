import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Camera, Loader } from 'lucide-react';
import ProfileCompletion from './ProfileCompletion';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        branch: '',
        year: '',
        cgpa: '',
        resumeUrl: '',
        portfolioUrl: '',
        githubProfile: '',
        linkedinProfile: '',
        leetcodeProfile: '',
        codeforcesProfile: '',
        codechefProfile: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/students/profile');

            setProfileData(prev => ({
                ...prev,
                ...response.data,

                phone: response.data.phone || prev.phone,
                location: response.data.location || prev.location,
                bio: response.data.bio || prev.bio
            }));
            console.log('Profile loaded:', response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);

            if (error.response?.status !== 404) {
                toast.error('Failed to load profile data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section) {
            setProfileData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
        } else {
            setProfileData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            console.log('Saving profile data:', profileData);
            const response = await api.put('/students/profile', profileData);
            console.log('Profile saved successfully:', response.data);
            setProfileData(prev => ({
                ...prev,
                ...response.data
            }));
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };



    const [completionStats, setCompletionStats] = useState({ completion: 0, missingFields: [] });

    useEffect(() => {
        calculateCompletion();
    }, [profileData]);

    const calculateCompletion = () => {
        const fields = [
            { key: 'name', label: 'Full Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone Number' },
            { key: 'location', label: 'Location' },
            { key: 'bio', label: 'Bio' },
            { key: 'branch', label: 'Branch/Department' },
            { key: 'year', label: 'Year' },
            { key: 'cgpa', label: 'CGPA' },
            { key: 'resumeUrl', label: 'Resume' },
            { key: 'interestAreas', label: 'Skills' }
        ];

        let filledCount = 0;
        const missing = [];

        fields.forEach(field => {
            const value = profileData[field.key];
            let isFilled = false;

            if (Array.isArray(value)) {
                isFilled = value.length > 0;
            } else if (value !== null && value !== undefined) {
                isFilled = value.toString().trim() !== '';
            }

            if (isFilled) {
                filledCount++;
            } else {
                missing.push(field.label);
            }
        });

        const percentage = Math.round((filledCount / fields.length) * 100);
        setCompletionStats({ completion: percentage, missingFields: missing });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <ProfileCompletion profileData={{ ...profileData, ...completionStats }} />

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-secondary">My Profile</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                >
                    {saving ? (
                        <>
                            <Loader className="animate-spin" size={20} />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>


            <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 mb-8 bg-white rounded-t-xl px-2">
                {['personal', 'education', 'socials', 'skills'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap capitalize ${activeTab === tab
                            ? 'border-primary text-primary'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        {tab === 'socials' ? 'Socials & Coding' : tab === 'education' ? 'Education & Work' : tab === 'skills' ? 'Skills & Interests' : 'Personal Details'}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-slate-100 p-6 lg:p-8 min-h-[500px]">
                {activeTab === 'personal' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="relative group mx-auto md:mx-0">
                                <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                                    <User className="text-slate-300" size={48} />
                                </div>
                                <button className="absolute bottom-0 right-0 p-2.5 bg-secondary text-white rounded-full hover:bg-slate-800 transition-colors shadow-sm">
                                    <Camera size={16} />
                                </button>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="Arpit Sarang"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="location"
                                            value={profileData.location}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="Mumbai, Maharashtra"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-full space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={profileData.bio}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {activeTab === 'education' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Branch/Department</label>
                                <input
                                    type="text"
                                    name="branch"
                                    value={profileData.branch || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Computer Science"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Year</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={profileData.year || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="3"
                                    min="1"
                                    max="5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">CGPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="cgpa"
                                    value={profileData.cgpa || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="8.5"
                                    min="0"
                                    max="10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Resume URL</label>
                                <input
                                    type="url"
                                    name="resumeUrl"
                                    value={profileData.resumeUrl || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Portfolio URL</label>
                                <input
                                    type="url"
                                    name="portfolioUrl"
                                    value={profileData.portfolioUrl || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="https://yourportfolio.com"
                                />
                            </div>
                        </div>
                    </div>
                )}


                {activeTab === 'socials' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h3 className="text-lg font-semibold text-secondary mb-4">Social Profiles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">LinkedIn Profile (Full URL)</label>
                                    <input
                                        type="url"
                                        name="linkedinProfile"
                                        value={profileData.linkedinProfile || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="https://linkedin.com/in/yourname"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">GitHub Username</label>
                                    <input
                                        type="text"
                                        name="githubProfile"
                                        value={profileData.githubProfile || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-secondary mb-4">Coding Profiles (Username Only)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">LeetCode</label>
                                    <input
                                        type="text"
                                        name="leetcodeProfile"
                                        value={profileData.leetcodeProfile || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Codeforces</label>
                                    <input
                                        type="text"
                                        name="codeforcesProfile"
                                        value={profileData.codeforcesProfile || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">CodeChef</label>
                                    <input
                                        type="text"
                                        name="codechefProfile"
                                        value={profileData.codechefProfile || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {activeTab === 'skills' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-sm font-medium text-slate-700 mb-2 block">
                                    Select Your Skills & Interests
                                </label>
                                <p className="text-xs text-slate-500 mb-3">
                                    Click to expand and select multiple skills
                                </p>


                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const dropdown = document.getElementById('skills-dropdown');
                                            dropdown.classList.toggle('hidden');
                                        }}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-left focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all flex items-center justify-between"
                                    >
                                        <span className="text-slate-700">
                                            {profileData.interestAreas?.length > 0
                                                ? `${profileData.interestAreas.length} skills selected`
                                                : 'Select skills...'}
                                        </span>
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <div
                                        id="skills-dropdown"
                                        className="hidden absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
                                    >

                                        <div className="sticky top-0 bg-white p-3 border-b border-slate-200">
                                            <input
                                                type="text"
                                                placeholder="Search skills..."
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                                                onChange={(e) => {
                                                    const search = e.target.value.toLowerCase();
                                                    const items = document.querySelectorAll('[data-skill-item]');
                                                    items.forEach(item => {
                                                        const text = item.textContent.toLowerCase();
                                                        item.style.display = text.includes(search) ? 'flex' : 'none';
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="p-2">

                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-slate-500 uppercase px-2 py-1">Programming Languages</p>
                                                {['JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'].map(skill => (
                                                    <label key={skill} data-skill-item className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={profileData.interestAreas?.includes(skill) || false}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: [...(prev.interestAreas || []), skill]
                                                                    }));
                                                                } else {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: prev.interestAreas.filter(s => s !== skill)
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                                                        />
                                                        <span className="ml-2 text-sm text-slate-700">{skill}</span>
                                                    </label>
                                                ))}
                                            </div>


                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-slate-500 uppercase px-2 py-1">Web Development</p>
                                                {['React', 'Node.js', 'Angular', 'Vue.js', 'Next.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'HTML/CSS', 'Tailwind CSS'].map(skill => (
                                                    <label key={skill} data-skill-item className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={profileData.interestAreas?.includes(skill) || false}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: [...(prev.interestAreas || []), skill]
                                                                    }));
                                                                } else {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: prev.interestAreas.filter(s => s !== skill)
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                                                        />
                                                        <span className="ml-2 text-sm text-slate-700">{skill}</span>
                                                    </label>
                                                ))}
                                            </div>


                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-slate-500 uppercase px-2 py-1">Databases</p>
                                                {['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Firebase', 'SQL Server'].map(skill => (
                                                    <label key={skill} data-skill-item className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={profileData.interestAreas?.includes(skill) || false}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: [...(prev.interestAreas || []), skill]
                                                                    }));
                                                                } else {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: prev.interestAreas.filter(s => s !== skill)
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                                                        />
                                                        <span className="ml-2 text-sm text-slate-700">{skill}</span>
                                                    </label>
                                                ))}
                                            </div>


                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-slate-500 uppercase px-2 py-1">Cloud & DevOps</p>
                                                {['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Git'].map(skill => (
                                                    <label key={skill} data-skill-item className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={profileData.interestAreas?.includes(skill) || false}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: [...(prev.interestAreas || []), skill]
                                                                    }));
                                                                } else {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: prev.interestAreas.filter(s => s !== skill)
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                                                        />
                                                        <span className="ml-2 text-sm text-slate-700">{skill}</span>
                                                    </label>
                                                ))}
                                            </div>


                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-slate-500 uppercase px-2 py-1">Data Science & AI</p>
                                                {['Machine Learning', 'Deep Learning', 'Data Analysis', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'].map(skill => (
                                                    <label key={skill} data-skill-item className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={profileData.interestAreas?.includes(skill) || false}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: [...(prev.interestAreas || []), skill]
                                                                    }));
                                                                } else {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: prev.interestAreas.filter(s => s !== skill)
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                                                        />
                                                        <span className="ml-2 text-sm text-slate-700">{skill}</span>
                                                    </label>
                                                ))}
                                            </div>


                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-slate-500 uppercase px-2 py-1">Mobile Development</p>
                                                {['React Native', 'Flutter', 'Android', 'iOS'].map(skill => (
                                                    <label key={skill} data-skill-item className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={profileData.interestAreas?.includes(skill) || false}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: [...(prev.interestAreas || []), skill]
                                                                    }));
                                                                } else {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: prev.interestAreas.filter(s => s !== skill)
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                                                        />
                                                        <span className="ml-2 text-sm text-slate-700">{skill}</span>
                                                    </label>
                                                ))}
                                            </div>


                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-slate-500 uppercase px-2 py-1">Other</p>
                                                {['Data Structures', 'Algorithms', 'System Design', 'Blockchain', 'GraphQL', 'REST API', 'Testing', 'Agile'].map(skill => (
                                                    <label key={skill} data-skill-item className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={profileData.interestAreas?.includes(skill) || false}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: [...(prev.interestAreas || []), skill]
                                                                    }));
                                                                } else {
                                                                    setProfileData(prev => ({
                                                                        ...prev,
                                                                        interestAreas: prev.interestAreas.filter(s => s !== skill)
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                                                        />
                                                        <span className="ml-2 text-sm text-slate-700">{skill}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {profileData.interestAreas && profileData.interestAreas.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-2">Selected Skills ({profileData.interestAreas.length})</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.interestAreas.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 flex items-center gap-2"
                                            >
                                                {skill}
                                                <button
                                                    onClick={() => {
                                                        setProfileData(prev => ({
                                                            ...prev,
                                                            interestAreas: prev.interestAreas.filter((_, i) => i !== index)
                                                        }));
                                                    }}
                                                    className="hover:text-red-600 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
