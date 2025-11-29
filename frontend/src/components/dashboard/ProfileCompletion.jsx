import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ProfileCompletion = ({ profileData }) => {
    // Calculate completion based on profileData
    const completion = profileData?.completion || 0;
    const missingFields = profileData?.missingFields || [];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-bold text-secondary">Profile Completion</h2>
                    <p className="text-sm text-slate-500">Complete your profile to get better job matches</p>
                </div>
                <span className="text-2xl font-bold text-primary">{completion}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${completion}%` }}
                />
            </div>

            {/* Suggestions */}
            {missingFields.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {missingFields.map((field, index) => (
                        <div key={index} className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-100">
                            <AlertCircle size={12} />
                            <span>Add {field}</span>
                        </div>
                    ))}
                </div>
            )}

            {completion === 100 && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle size={16} />
                    <span>Your profile is complete! You're all set to apply.</span>
                </div>
            )}
        </div>
    );
};

export default ProfileCompletion;
