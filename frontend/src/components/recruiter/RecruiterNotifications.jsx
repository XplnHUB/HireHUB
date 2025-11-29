import React from 'react';
import { Bell, UserPlus, Calendar, FileText, Info } from 'lucide-react';

const RecruiterNotifications = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const notifications = [
        {
            id: 1,
            type: 'application',
            title: 'New Application',
            message: 'John Doe applied for Frontend Developer role.',
            time: '10 mins ago',
            read: false
        },
        {
            id: 2,
            type: 'interview',
            title: 'Interview Confirmed',
            message: 'Sarah accepted the interview invite for tomorrow.',
            time: '1 hour ago',
            read: false
        },
        {
            id: 3,
            type: 'system',
            title: 'Job Post Expiring',
            message: 'Your "Backend Engineer" post expires in 2 days.',
            time: '5 hours ago',
            read: true
        }
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'application': return <UserPlus size={16} className="text-blue-500" />;
            case 'interview': return <Calendar size={16} className="text-purple-500" />;
            case 'system': return <Info size={16} className="text-orange-500" />;
            default: return <Bell size={16} className="text-slate-500" />;
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 z-30"
                onClick={onClose}
            />
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-40 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-secondary">Notifications</h3>
                    <button className="text-xs text-primary font-medium hover:underline">Mark all as read</button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/30' : ''}`}
                        >
                            <div className="flex gap-3">
                                <div className="mt-1 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                                    {getIcon(notification.type)}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-medium ${!notification.read ? 'text-secondary' : 'text-slate-600'}`}>
                                        {notification.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notification.message}</p>
                                    <span className="text-[10px] text-slate-400 mt-2 block">{notification.time}</span>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-3 text-center border-t border-slate-100 bg-slate-50">
                    <button className="text-xs font-medium text-slate-500 hover:text-primary">View All Notifications</button>
                </div>
            </div>
        </>
    );
};

export default RecruiterNotifications;
