import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Ansh Sharma",
            role: "SWE at Google",
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
            quote: "HireHUB is a game changer. Landed my dream role at Google without the usual stress. It just works."
        },
        {
            name: "Sunny Singh",
            role: "SWE at Amazon",
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
            quote: "Finally, a platform that gets it. Found top-tier talent for Amazon in record time. The vibe check is real."
        },
        {
            name: "Suraj Kulkarni",
            role: "Founder",
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
            quote: "Used to be a nightmare, now it's a breeze. HireHUB automated the boring stuff so we could focus on the people."
        }
    ];

    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                        Trusted by Students & Recruiters
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Don't just take our word for it. Hear from the people who use HireHUB every day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-background p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                        >
                            <div className="flex items-center gap-1 mb-6 text-accent">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill="currentColor" />
                                ))}
                            </div>

                            <p className="text-text-secondary mb-8 flex-grow italic">
                                "{testimonial.quote}"
                            </p>

                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                                />
                                <div>
                                    <h4 className="font-bold text-secondary">{testimonial.name}</h4>
                                    <p className="text-sm text-text-light">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
