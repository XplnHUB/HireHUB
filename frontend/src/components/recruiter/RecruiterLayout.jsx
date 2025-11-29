import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Calendar,
    BarChart2,
    Building2,
    Settings,
    LogOut,
    Menu,
    X,
    Search,
    Bell
} from 'lucide-react';
import RecruiterNotifications from './RecruiterNotifications';

const RecruiterLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [recruiterData, setRecruiterData] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Get recruiter data from localStorage
        const user = localStorage.getItem('hb_user');
        if (user) {
            try {
                setRecruiterData(JSON.parse(user));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const getInitials = (name) => {
        if (!name) return 'HR';
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const navigation = [
        { name: 'Dashboard', href: '/recruiter', icon: LayoutDashboard },
        { name: 'Jobs', href: '/recruiter/jobs', icon: Briefcase },
        { name: 'Candidates', href: '/recruiter/candidates', icon: Users },
        { name: 'Interviews', href: '/recruiter/interviews', icon: Calendar },
        { name: 'Analytics', href: '/recruiter/analytics', icon: BarChart2 },
        { name: 'Company', href: '/recruiter/company', icon: Building2 },
        { name: 'Settings', href: '/recruiter/settings', icon: Settings },
    ];

    const isActive = (path) => {
        if (path === '/recruiter' && location.pathname !== '/recruiter') return false;
        return location.pathname.startsWith(path);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        localStorage.removeItem('hb_access_token');
        localStorage.removeItem('hb_refresh_token');
        localStorage.removeItem('hb_user');
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary text-white transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                        <Link className="text-2xl font-bold text-primary" data-discover="true" to="/">
                            HireHUB
                        </Link>
                        <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${active
                                            ? 'bg-primary text-white'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Recruiter Profile & Logout */}
                    <div className="p-4 border-t border-slate-700">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {getInitials(recruiterData?.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {recruiterData?.name || 'Recruiter'}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {recruiterData?.companyName || 'Recruiter'}
                                </p>
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 py-3 lg:px-8">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden text-slate-600 hover:text-primary"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="flex-1 max-w-xl mx-4 lg:mx-0 lg:mr-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search candidates, jobs..."
                                    className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-primary/50 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="relative p-2 text-slate-600 hover:text-primary transition-colors"
                            >
                                <Bell size={24} />
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            <RecruiterNotifications
                                isOpen={isNotificationsOpen}
                                onClose={() => setIsNotificationsOpen(false)}
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default RecruiterLayout;
