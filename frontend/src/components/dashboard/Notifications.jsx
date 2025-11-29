import React from 'react';
import { Bell, Briefcase, Calendar, Info, CheckCircle } from 'lucide-react';

const Notifications = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [notifications, setNotifications] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            const response = await import('../../api/axios').then(module => module.default.get('/notifications'));
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await import('../../api/axios').then(module => module.default.patch(`/notifications/${id}/read`));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await import('../../api/axios').then(module => module.default.patch('/notifications/read-all'));
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'job': return <Briefcase size={16} className="text-blue-500" />;
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
                    <button onClick={markAllAsRead} className="text-xs text-primary font-medium hover:underline">Mark all as read</button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-slate-500">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">No notifications</div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className="mt-1 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-secondary' : 'text-slate-600'}`}>
                                            {notification.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notification.message}</p>
                                        <span className="text-[10px] text-slate-400 mt-2 block">{new Date(notification.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-3 text-center border-t border-slate-100 bg-slate-50">
                    <button className="text-xs font-medium text-slate-500 hover:text-primary">View All Notifications</button>
                </div>
            </div>
        </>
    );
};

export default Notifications;
