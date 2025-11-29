import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    Briefcase,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    Search
} from 'lucide-react';

import Notifications from './Notifications';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
        { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="flex h-screen bg-slate-50">

            <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary text-white transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="h-full flex flex-col">

                    <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                        <Link className="text-2xl font-bold text-primary" data-discover="true" to="/">
                            HireHUB
                        </Link>
                        <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>


                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                    ${active ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}
                  `}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>


                    <div className="p-4 border-t border-slate-700">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-slate-400 truncate capitalize">{user?.role || 'Student'}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>


            <div className="flex-1 flex flex-col overflow-hidden">

                <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                    <button onClick={toggleSidebar} className="lg:hidden text-slate-700">
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 max-w-2xl mx-auto lg:mx-0 lg:ml-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search jobs, companies..."
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-primary/50 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <Bell size={22} className="text-slate-700" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                        </button>

                        {isNotificationsOpen && (
                            <Notifications onClose={() => setIsNotificationsOpen(false)} />
                        )}
                    </div>
                </header>


                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>


            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;
