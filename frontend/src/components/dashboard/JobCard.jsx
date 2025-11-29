import React from 'react';
import { MapPin, Clock, DollarSign, Building2, ArrowRight, CheckCircle } from 'lucide-react';

const JobCard = ({ job, onApply }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-2xl">
                        {job.logo || <Building2 className="text-slate-400" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">{job.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{job.company}</p>
                    </div>
                </div>
                {job.hasApplied ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                        <CheckCircle size={12} /> Applied
                    </span>
                ) : (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {job.type}
                    </span>
                )}
            </div>

            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={14} />
                    {job.location || 'Remote'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock size={14} />
                    {job.postedAt || 'Recently'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <DollarSign size={14} />
                    {job.salary || 'Competitive'}
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-2">
                    {job.tags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs">
                            {tag}
                        </span>
                    ))}
                    {(job.tags?.length || 0) > 2 && (
                        <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs">
                            +{job.tags.length - 2}
                        </span>
                    )}
                </div>

                {!job.hasApplied && (
                    <button
                        onClick={() => onApply(job.id)}
                        disabled={job.isApplying}
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:text-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {job.isApplying ? 'Applying...' : 'Apply Now'} <ArrowRight size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobCard;
