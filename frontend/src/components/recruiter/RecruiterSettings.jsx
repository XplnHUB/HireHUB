import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Camera } from 'lucide-react';

const RecruiterSettings = () => {
    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState({
        firstName: 'Sarah',
        lastName: 'Smith',
        email: 'sarah@techcorp.com',
        phone: '+1 (555) 123-4567',
        role: 'Lead Recruiter',
        bio: 'Passionate about finding the best talent for TechCorp.',
        avatar: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-secondary">Account Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
                >
                    {loading ? 'Saving...' : (
                        <>
                            <Save size={20} />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 lg:p-8">
                <div className="flex items-start gap-8 mb-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-slate-300">SS</span>
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-secondary text-white rounded-full hover:bg-slate-800 transition-colors shadow-sm">
                            <Camera size={14} />
                        </button>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-secondary">{profile.firstName} {profile.lastName}</h3>
                        <p className="text-slate-500">{profile.role}</p>
                        <button className="mt-2 text-sm text-primary font-medium hover:underline">Change Profile Picture</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">First Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Last Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                                value={profile.phone}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-sm font-medium text-slate-700">Role / Title</label>
                        <input
                            type="text"
                            name="role"
                            value={profile.role}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-sm font-medium text-slate-700">Bio</label>
                        <textarea
                            name="bio"
                            value={profile.bio}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        />
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                    <h3 className="font-bold text-secondary mb-4">Security</h3>
                    <button className="flex items-center gap-2 text-primary font-medium hover:underline">
                        <Lock size={16} /> Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecruiterSettings;
