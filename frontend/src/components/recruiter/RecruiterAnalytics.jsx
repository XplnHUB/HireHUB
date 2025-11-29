import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Clock, CheckCircle, ArrowUpRight, ArrowDownRight, Loader } from 'lucide-react';
import api from '../../api/axios';

const RecruiterAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        applicants: { value: 0, change: 0, trend: 'neutral' },
        timeToHire: { value: '0 days', change: '0 days', trend: 'neutral' },
        hireRate: { value: '0%', change: '0%', trend: 'neutral' },
        activeJobs: { value: 0, change: 0, trend: 'neutral' },
        topSkills: [],
        pipeline: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/recruiters/analytics');
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const metrics = [
        { label: 'Total Applicants', ...analytics.applicants, icon: Users, color: 'blue' },
        { label: 'Time to Hire', ...analytics.timeToHire, icon: Clock, color: 'purple' },
        { label: 'Hire Rate', ...analytics.hireRate, icon: TrendingUp, color: 'orange' },
        { label: 'Active Jobs', ...analytics.activeJobs, icon: CheckCircle, color: 'green' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-secondary">Recruitment Analytics</h1>
                <p className="text-slate-500">Insights into your hiring pipeline and performance</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-lg bg-${metric.color}-50 text-${metric.color}-600 flex items-center justify-center`}>
                                    <Icon size={20} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-medium ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
                                    {metric.change}
                                    {metric.trend === 'up' && <ArrowUpRight size={14} />}
                                    {metric.trend === 'down' && <ArrowDownRight size={14} />}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-secondary mb-1">{metric.value}</h3>
                            <p className="text-sm text-slate-500">{metric.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Mocked for now as charting lib needs setup) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-secondary">Application Trends</h3>
                        <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 focus:ring-0 text-slate-600">
                            <option>Last 30 Days</option>
                            <option>Last 6 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
                        Chart visualization would go here
                    </div>
                </div>

                {/* Top Sources / Skills */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-secondary mb-4">Top Skills in Demand</h3>
                        <div className="space-y-4">
                            {analytics.topSkills.map((skill, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-secondary">{skill.name}</span>
                                        <span className="text-slate-500">{skill.count}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-blue-500`}
                                            style={{ width: `${skill.count}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-secondary mb-4">Pipeline Conversion</h3>
                        <div className="space-y-6 relative">
                            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                            {analytics.pipeline.map((step, i) => (
                                <div key={i} className="relative flex items-center justify-between z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white border-2 border-primary flex items-center justify-center text-xs font-bold text-secondary">
                                            {i + 1}
                                        </div>
                                        <span className="font-medium text-secondary">{step.stage}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-secondary">{step.count}</div>
                                        {i > 0 && step.drop > 0 && <div className="text-xs text-red-500">-{step.drop}% drop</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterAnalytics;
