import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-warm opacity-50"></div>
            <div className="absolute top-20 right-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">


                    <div className="flex-1 text-center lg:text-left animate-slide-up">
                        <div className="inline-flex items-center gap-2 bg-orange-100 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            New Year, Real Opportunities
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-secondary leading-tight mb-6">
                            Real Matches. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                No Corporate Fluff.
                            </span>
                        </h1>

                        <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Stop sending resumes into the void. Let the right companies find you based on what you're actually good at.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button
                                onClick={() => navigate('/auth')}
                                className="w-full sm:w-auto bg-primary hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-xl hover:shadow-orange-500/20 flex items-center justify-center gap-2 group"
                            >
                                Let's Go
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </button>

                            <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-secondary border border-gray-200 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-lg flex items-center justify-center gap-2">
                                <PlayCircle size={20} />
                                See How It Works
                            </button>
                        </div>

                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-text-light text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full"></div>
                                500+ Companies
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full"></div>
                                10k+ Students
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full"></div>
                                Match Made 🎯
                            </div>
                        </div>
                    </div>


                    <div className="flex-1 relative animate-float">
                        <div className="relative z-10 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80"
                                alt="Students collaborating"
                                className="rounded-xl w-full object-cover h-[400px] lg:h-[500px]"
                            />


                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-50 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <div>
                                    <p className="text-xs text-text-light">Status</p>
                                    <p className="font-bold text-secondary">Match Made 🎯</p>
                                </div>
                            </div>

                            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-50 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-primary">
                                    ★
                                </div>
                                <div>
                                    <p className="text-xs text-text-light">Vibe Check</p>
                                    <p className="font-bold text-secondary">Passed</p>
                                </div>
                            </div>
                        </div>


                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-200/30 blur-3xl -z-10 rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
