import React, { useState } from 'react';

const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState('students');

    const steps = {
        students: [
            {
                step: "01",
                title: "Tell Your Story",
                description: "Sign up and build a profile that shows the real you—skills, projects, and personality."
            },
            {
                step: "02",
                title: "Show Your Skills",
                description: "Upload your resume, but don't stop there. Let our system highlight your superpowers."
            },
            {
                step: "03",
                title: "Get Matched",
                description: "Browse roles that actually fit. Apply with one click and track your status live."
            }
        ],
        recruiters: [
            {
                step: "01",
                title: "Find Talent",
                description: "Post roles and let our matching engine find candidates who vibe with your mission."
            },
            {
                step: "02",
                title: "Vibe Check",
                description: "Filter and review profiles that match your criteria. No more sifting through noise."
            },
            {
                step: "03",
                title: "Meet Them",
                description: "Shortlist your favorites and schedule interviews instantly. Let's get it done."
            }
        ]
    };

    return (
        <section id="how-it-works" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                        How It Works
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mb-8">
                        Simple workflows designed to make the placement process efficient for everyone.
                    </p>

                    {/* Tabs */}
                    <div className="inline-flex bg-white p-1 rounded-full border border-gray-200 shadow-sm">
                        {['students', 'recruiters'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 capitalize ${activeTab === tab
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-text-secondary hover:text-primary'
                                    }`}
                            >
                                For {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden md:block absolute top-16 left-0 w-full h-0.5 bg-orange-200 -z-10"></div>

                    {steps[activeTab].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 text-center group"
                        >
                            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-6 border-4 border-white shadow-sm group-hover:scale-110 transition-transform">
                                {item.step}
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-3">
                                {item.title}
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
