import React, { useEffect, useState, useRef } from 'react';

const Stats = () => {
    const stats = [
        { label: 'Students Registered', value: 500, suffix: '+' },
        { label: 'Recruiters Onboarded', value: 20, suffix: '+' },
        { label: 'Jobs Posted', value: 150, suffix: '+' },
        { label: 'Applications Submitted', value: 1200, suffix: '+' },
    ];

    const Counter = ({ end, duration = 2000 }) => {
        const [count, setCount] = useState(0);
        const countRef = useRef(null);
        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                },
                { threshold: 0.1 }
            );

            if (countRef.current) {
                observer.observe(countRef.current);
            }

            return () => {
                if (countRef.current) {
                    observer.unobserve(countRef.current);
                }
            };
        }, []);

        useEffect(() => {
            if (!isVisible) return;

            let startTime;
            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                setCount(Math.floor(progress * end));

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };

            window.requestAnimationFrame(step);
        }, [isVisible, end, duration]);

        return <span ref={countRef}>{count.toLocaleString()}</span>;
    };

    return (
        <section className="py-20 bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="p-4">
                            <div className="text-4xl lg:text-5xl font-bold mb-2">
                                <Counter end={stat.value} />
                                {stat.suffix}
                            </div>
                            <div className="text-blue-100 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
