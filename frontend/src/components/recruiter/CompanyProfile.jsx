import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Globe, Linkedin, Twitter, Upload, Save, Users, Plus, Trash2, Loader } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const CompanyProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    const [companyData, setCompanyData] = useState({
        name: '',
        description: '',
        mission: '',
        website: '',
        linkedin: '',
        twitter: '',
        location: '',
        logo: null,
        cover: null,
        team: []
    });

    useEffect(() => {
        fetchCompanyProfile();
        fetchTeamMembers();
    }, []);

    const fetchCompanyProfile = async () => {
        try {
            const response = await api.get('/recruiters/company');
            setCompanyData(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error('Error fetching company profile:', error);
            if (error.response?.status !== 404) {
                toast.error('Failed to load company profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const response = await api.get('/recruiters/team');
            setCompanyData(prev => ({ ...prev, team: response.data }));
        } catch (error) {
            console.error('Error fetching team members:', error);
            // Don't show error toast if no team members found
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/recruiters/company', companyData);
            toast.success('Company profile updated successfully!');
        } catch (error) {
            console.error('Error saving company profile:', error);
            toast.error('Failed to save company profile');
        } finally {
            setSaving(false);
        }
    };

    const removeTeamMember = (id) => {
        setCompanyData(prev => ({
            ...prev,
            team: prev.team.filter(member => member.id !== id)
        }));
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
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-secondary">Company Profile</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70 font-medium shadow-sm hover:shadow-md"
                >
                    {saving ? 'Saving...' : (
                        <>
                            <Save size={20} />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-8">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Company Details
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'team' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Team Members
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 lg:p-8">
                {activeTab === 'details' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Branding */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-700">Company Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden">
                                        {companyData.logo ? (
                                            <img src={companyData.logo} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="text-slate-400" size={32} />
                                        )}
                                    </div>
                                    <button className="px-4 py-2 text-sm font-medium text-secondary border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                        Upload Logo
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-700">Cover Image</label>
                                <div className="w-full h-24 rounded-xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors">
                                    {companyData.cover ? (
                                        <img src={companyData.cover} alt="Cover" className="w-full h-full object-cover" />
                                    ) : (
                                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary">
                                            <Upload size={16} /> Upload Cover
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Company Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={companyData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="TechCorp Inc."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        name="location"
                                        value={companyData.location}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="San Francisco, CA"
                                    />
                                </div>
                            </div>
                            <div className="col-span-full space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    name="description"
                                    value={companyData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="Brief description of your company..."
                                />
                            </div>
                            <div className="col-span-full space-y-2">
                                <label className="text-sm font-medium text-slate-700">Mission Statement</label>
                                <textarea
                                    name="mission"
                                    value={companyData.mission}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="Your company's mission..."
                                />
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="font-bold text-secondary">Social Presence</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Globe size={16} className="text-slate-500" /> Website
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={companyData.website}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Linkedin size={16} className="text-[#0077b5]" /> LinkedIn
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={companyData.linkedin}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="https://linkedin.com/company/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Twitter size={16} className="text-[#1DA1F2]" /> Twitter
                                    </label>
                                    <input
                                        type="url"
                                        name="twitter"
                                        value={companyData.twitter}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-secondary">Team Members</h3>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/20 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                                <Plus size={16} /> Add Member
                            </button>
                        </div>

                        <div className="space-y-4">
                            {companyData.team.length > 0 ? companyData.team.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary font-bold shadow-sm border border-slate-100">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-secondary">{member.name}</h4>
                                            <p className="text-sm text-slate-500">{member.role} • {member.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeTeamMember(member.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                                    <Users className="mx-auto mb-2 text-slate-300" size={32} />
                                    <p>No team members added yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;
