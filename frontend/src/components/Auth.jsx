import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Briefcase, GraduationCap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        companyWebsite: '',
        industry: ''
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login, register } = useAuth();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isLogin && formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match!");
            setLoading(false);
            return;
        }

        let result;
        if (isLogin) {
            result = await login(formData.email, formData.password, role);
        } else {
            const registerData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            };

            if (role === 'recruiter') {
                registerData.companyName = formData.companyName;
                registerData.companyWebsite = formData.companyWebsite;
                registerData.industry = formData.industry;
            }

            result = await register(registerData, role);
        }

        if (result.success) {
            toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');

            const userRole = isLogin ? JSON.parse(localStorage.getItem('user'))?.role : role;
            if (userRole === 'recruiter') {
                navigate('/recruiter');
            } else {
                navigate('/dashboard');
            }
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-fade-in">


                <div className="w-full md:w-1/2 p-8 lg:p-12">

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-600 hover:text-secondary transition-colors mb-6 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </button>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-secondary mb-2">
                            {isLogin ? 'Welcome Back!' : 'Create Account'}
                        </h2>
                        <p className="text-slate-500">
                            {isLogin ? 'Enter your credentials to access your account.' : 'Join HireHUB to start your journey.'}
                        </p>
                    </div>


                    <div className="flex gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${role === 'student'
                                ? 'border-primary bg-primary/5 text-primary font-bold'
                                : 'border-slate-100 text-slate-500 hover:border-slate-200'
                                }`}
                        >
                            <GraduationCap size={20} />
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('recruiter')}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${role === 'recruiter'
                                ? 'border-secondary bg-secondary/5 text-secondary font-bold'
                                : 'border-slate-100 text-slate-500 hover:border-slate-200'
                                }`}
                        >
                            <Briefcase size={20} />
                            Recruiter
                        </button>
                    </div>

                    {isLogin && (
                        <div className="mb-6 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setRole('student');
                                    setFormData({ ...formData, email: 'demo.student@example.com', password: 'student123' });
                                }}
                                className="text-xs py-2 px-3 rounded-lg border border-dashed border-primary/50 text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
                            >
                                <User size={14} />
                                Demo Student
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setRole('recruiter');
                                    setFormData({ ...formData, email: 'demo.recruiter@example.com', password: 'recruiter123' });
                                }}
                                className="text-xs py-2 px-3 rounded-lg border border-dashed border-secondary/50 text-secondary hover:bg-secondary/5 transition-colors flex items-center justify-center gap-1"
                            >
                                <Briefcase size={14} />
                                Demo Recruiter
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                required
                            />
                        </div>

                        {!isLogin && role === 'recruiter' && (
                            <>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        name="companyName"
                                        placeholder="Company Name"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        name="companyWebsite"
                                        placeholder="Company Website (Optional)"
                                        value={formData.companyWebsite}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        name="industry"
                                        placeholder="Industry (e.g. IT, Finance)"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </>
                        )}

                        {!isLogin && (
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    required
                                />
                            </div>
                        )}

                        {isLogin && (
                            <div className="text-right">
                                <a href="#" className="text-sm text-primary font-medium hover:underline">Forgot Password?</a>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-secondary font-bold hover:underline"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>


                <div className="hidden md:block w-1/2 bg-secondary p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">HireHUB</h3>
                            <p className="text-slate-300">The ultimate platform for students and recruiters to connect, grow, and succeed.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-accent">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold">For Recruiters</h4>
                                    <p className="text-sm text-slate-400">Find top talent efficiently with AI-powered matching.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-primary">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold">For Students</h4>
                                    <p className="text-sm text-slate-400">Land your dream job with personalized recommendations.</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-slate-400">
                            &copy; 2025 HireHUB. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
