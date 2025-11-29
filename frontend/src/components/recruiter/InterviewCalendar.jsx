import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Video, MapPin, User, Loader } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const InterviewCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const response = await api.get('/interviews');
            setInterviews(response.data);
        } catch (error) {
            console.error('Error fetching interviews:', error);
            toast.error('Failed to load interviews');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    const mockInterviews = [
        {
            id: 1,
            candidate: 'John Doe',
            role: 'Frontend Developer',
            time: '10:00 AM',
            duration: '1h',
            type: 'Technical Round',
            mode: 'Video',
            interviewer: 'Sarah Smith'
        },
        {
            id: 2,
            candidate: 'Alice Cooper',
            role: 'Product Designer',
            time: '02:00 PM',
            duration: '45m',
            type: 'Portfolio Review',
            mode: 'Video',
            interviewer: 'Mike Johnson'
        },
        {
            id: 3,
            candidate: 'Bob Smith',
            role: 'Backend Engineer',
            time: '04:00 PM',
            duration: '1h',
            type: 'System Design',
            mode: 'Onsite',
            interviewer: 'David Lee'
        }
    ];

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Interview Schedule</h1>
                    <p className="text-slate-500">Manage upcoming interviews and availability</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                    <Plus size={20} /> Schedule Interview
                </button>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
                {/* Sidebar / Mini Calendar */}
                <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-100 p-6 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-secondary">November 2025</h3>
                        <div className="flex gap-2">
                            <button className="p-1 hover:bg-slate-200 rounded"><ChevronLeft size={16} /></button>
                            <button className="p-1 hover:bg-slate-200 rounded"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                        {days.map(day => <span key={day} className="text-slate-400 font-medium text-xs">{day}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                        {Array.from({ length: 30 }, (_, i) => (
                            <button
                                key={i}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${i === 23 ? 'bg-primary text-white font-bold' : 'hover:bg-slate-200 text-slate-600'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8">
                        <h3 className="font-bold text-secondary mb-4">Upcoming Today</h3>
                        <div className="space-y-3">
                            {interviews.map(interview => (
                                <div key={interview.id} className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{interview.time}</span>
                                        <span className="text-[10px] text-slate-400">{interview.duration}</span>
                                    </div>
                                    <h4 className="font-bold text-secondary text-sm">{interview.candidate}</h4>
                                    <p className="text-xs text-slate-500 mb-2">{interview.role}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        {interview.mode === 'Video' ? <Video size={12} /> : <MapPin size={12} />}
                                        <span>{interview.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Calendar View */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-bold text-secondary">Monday, Nov 24</h2>
                            <div className="flex bg-slate-100 rounded-lg p-1">
                                <button className="px-3 py-1 bg-white shadow-sm rounded text-xs font-medium text-secondary">Day</button>
                                <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-secondary">Week</button>
                                <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-secondary">Month</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {timeSlots.map(time => {
                                const interview = interviews.find(i => i.time === time);
                                return (
                                    <div key={time} className="flex gap-4 group">
                                        <div className="w-20 text-xs font-medium text-slate-400 pt-2 text-right">{time}</div>
                                        <div className="flex-1 min-h-[4rem] border-t border-slate-100 relative group-hover:bg-slate-50/50 transition-colors">
                                            {interview && (
                                                <div className="absolute top-1 left-0 right-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg cursor-pointer hover:shadow-md transition-all">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-blue-900 text-sm">{interview.candidate} - {interview.role}</h4>
                                                            <p className="text-xs text-blue-700">{interview.type} with {interview.interviewer}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-blue-600 bg-white/50 px-2 py-1 rounded">
                                                            {interview.mode === 'Video' ? <Video size={12} /> : <MapPin size={12} />}
                                                            {interview.mode}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewCalendar;
