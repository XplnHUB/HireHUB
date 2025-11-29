import React from 'react';
import { User, Briefcase, FileText, LayoutDashboard, Upload, Calendar, Users, BarChart2, Shield } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <User className="w-6 h-6 text-primary" />,
            title: "Your Story",
            description: "More than a resume. Show who you actually are with a profile that highlights your real skills."
        },
        {
            icon: <Briefcase className="w-6 h-6 text-primary" />,
            title: "Real Roles",
            description: "No ghost jobs. Access opportunities from companies that are actually hiring right now."
        },
        {
            icon: <FileText className="w-6 h-6 text-primary" />,
            title: "Live Status",
            description: "Stop guessing. Track your applications in real-time and know exactly where you stand."
        },
        {
            icon: <LayoutDashboard className="w-6 h-6 text-primary" />,
            title: "Talent Hub",
            description: "For recruiters: Find people who actually fit your vibe, not just keywords on a page."
        },
        {
            icon: <Upload className="w-6 h-6 text-primary" />,
            title: "Skill Showcase",
            description: "Drag, drop, done. We parse your info so you can focus on showing off your work."
        },
        {
            icon: <Calendar className="w-6 h-6 text-primary" />,
            title: "Next Round",
            description: "Coordinate interviews without the email ping-pong. Smooth scheduling for everyone."
        },
        {
            icon: <Users className="w-6 h-6 text-primary" />,
            title: "Community Access",
            description: "Admin tools to keep the platform safe, verified, and full of real people."
        },
        {
            icon: <BarChart2 className="w-6 h-6 text-primary" />,
            title: "The Numbers",
            description: "Real insights into placement trends. See what's working and what's trending."
        },
        {
            icon: <Shield className="w-6 h-6 text-primary" />,
            title: "Locked Down",
            description: "Your data is yours. Enterprise-grade security to keep everything safe and private."
        }
    ];

    return (
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                        Powerful Features for Everyone
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Whether you're a student, recruiter, or administrator, HireHUB provides the tools you need to succeed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl bg-background border border-gray-100 hover:border-primary/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
