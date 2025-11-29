import React from 'react';
import { X, MapPin, Mail, Phone, Globe, Github, Linkedin, Download, ExternalLink, Calendar } from 'lucide-react';

const CandidateProfile = ({ candidate, onClose }) => {
    if (!candidate) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

                <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center text-2xl font-bold text-secondary">
                            {candidate.initials || candidate.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-secondary">{candidate.name}</h2>
                            <p className="text-slate-500 font-medium">{candidate.role}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} /> San Francisco, CA
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} /> {candidate.experience} Exp
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                            Schedule Interview
                        </button>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-secondary hover:bg-slate-200 rounded-lg transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-secondary mb-3">About</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Passionate frontend developer with 3 years of experience building responsive web applications.
                                    Skilled in React, Tailwind CSS, and modern JavaScript. Loves creating intuitive user experiences
                                    and writing clean, maintainable code.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-secondary mb-3">Experience</h3>
                                <div className="space-y-6 relative border-l-2 border-slate-100 ml-3 pl-8">
                                    <div className="relative">
                                        <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full border-4 border-white bg-primary shadow-sm"></div>
                                        <h4 className="font-bold text-secondary">Senior Frontend Developer</h4>
                                        <p className="text-sm text-slate-500 mb-2">TechCorp Inc. • 2022 - Present</p>
                                        <p className="text-slate-600 text-sm">
                                            Led the frontend team in rebuilding the core product dashboard. Improved performance by 40%.
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full border-4 border-white bg-slate-300 shadow-sm"></div>
                                        <h4 className="font-bold text-secondary">Web Developer</h4>
                                        <p className="text-sm text-slate-500 mb-2">StartupHub • 2020 - 2022</p>
                                        <p className="text-slate-600 text-sm">
                                            Developed and maintained multiple client websites using React and Next.js.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-secondary mb-3">Projects</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-slate-100 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-secondary group-hover:text-primary transition-colors">E-commerce Dashboard</h4>
                                            <ExternalLink size={16} className="text-slate-400" />
                                        </div>
                                        <p className="text-sm text-slate-500 mb-3">A full-featured analytics dashboard for online stores.</p>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded">React</span>
                                            <span className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded">D3.js</span>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-slate-100 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-secondary group-hover:text-primary transition-colors">Task Manager App</h4>
                                            <ExternalLink size={16} className="text-slate-400" />
                                        </div>
                                        <p className="text-sm text-slate-500 mb-3">Collaborative task management tool for teams.</p>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded">Vue.js</span>
                                            <span className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded">Firebase</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>


                        <div className="space-y-6">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                                <h3 className="font-bold text-secondary text-sm uppercase tracking-wider">Contact Info</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Mail size={16} className="text-slate-400" />
                                        <a href="mailto:john@example.com" className="hover:text-primary">john@example.com</a>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Phone size={16} className="text-slate-400" />
                                        <a href="tel:+15551234567" className="hover:text-primary">+1 (555) 123-4567</a>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Globe size={16} className="text-slate-400" />
                                        <a href="#" className="hover:text-primary">johndoe.dev</a>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-200 flex gap-3">
                                    <a href="#" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-[#0077b5] hover:border-[#0077b5] transition-colors">
                                        <Linkedin size={18} />
                                    </a>
                                    <a href="#" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-colors">
                                        <Github size={18} />
                                    </a>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-secondary text-sm uppercase tracking-wider mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'GraphQL', 'AWS'].map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                                <Download size={18} /> Download Resume
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;
