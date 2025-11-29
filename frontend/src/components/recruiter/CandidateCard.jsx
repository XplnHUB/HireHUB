import React, { useState } from 'react';
import { MapPin, Briefcase, GraduationCap, Github, Linkedin, FileText, MoreHorizontal, Check, X, Calendar, UserCheck } from 'lucide-react';

const CandidateCard = ({ candidate, onStatusChange }) => {
    const [showActions, setShowActions] = useState(false);


    const skills = candidate?.skills || [];
    const links = candidate?.links || {};

    const statusActions = [
        { id: 'shortlisted', label: 'Shortlist', icon: Check, color: 'text-purple-600 hover:bg-purple-50' },
        { id: 'interview', label: 'Schedule Interview', icon: Calendar, color: 'text-orange-600 hover:bg-orange-50' },
        { id: 'hired', label: 'Hire', icon: UserCheck, color: 'text-green-600 hover:bg-green-50' },
        { id: 'rejected', label: 'Reject', icon: X, color: 'text-red-600 hover:bg-red-50' },
    ];


    const availableActions = statusActions.filter(action => action.id !== candidate?.stage);

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-secondary font-bold">
                        {candidate?.initials || candidate?.name?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <div>
                        <h4 className="font-bold text-secondary text-sm">{candidate?.name || 'Unknown'}</h4>
                        <p className="text-xs text-slate-500">{candidate?.role || 'No role specified'}</p>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowActions(!showActions);
                        }}
                        className="text-slate-400 hover:text-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreHorizontal size={16} />
                    </button>

                    {showActions && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowActions(false)}
                            />
                            <div className="absolute right-0 top-6 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-48">
                                {availableActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={action.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStatusChange(candidate.id, action.id);
                                                setShowActions(false);
                                            }}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${action.color}`}
                                        >
                                            <Icon size={14} />
                                            {action.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Briefcase size={12} />
                    <span>{candidate?.experience || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <GraduationCap size={12} />
                    <span>{candidate?.education || 'Not specified'}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] font-medium border border-slate-100">
                        {skill}
                    </span>
                ))}
                {skills.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] font-medium border border-slate-100">
                        +{skills.length - 3}
                    </span>
                )}
                {skills.length === 0 && (
                    <span className="text-xs text-slate-400">No skills listed</span>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex gap-2">
                    {links.github && (
                        <a href={links.github} className="text-slate-400 hover:text-slate-800" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <Github size={14} />
                        </a>
                    )}
                    {links.linkedin && (
                        <a href={links.linkedin} className="text-slate-400 hover:text-[#0077b5]" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <Linkedin size={14} />
                        </a>
                    )}
                    {candidate?.resumeUrl && (
                        <a href={candidate.resumeUrl} className="text-slate-400 hover:text-primary" title="View Resume" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <FileText size={14} />
                        </a>
                    )}
                </div>
                <span className="text-[10px] text-slate-400">{candidate?.applied || 'N/A'}</span>
            </div>
        </div>
    );
};

export default CandidateCard;
