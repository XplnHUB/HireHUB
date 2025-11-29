import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Testimonials', href: '#testimonials' },
    ];

    return (
        <nav className={`fixed z-50 transition-all duration-500 ${scrolled
            ? 'top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] max-w-5xl rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-gray-100 py-3 px-8'
            : 'top-0 left-0 w-full bg-transparent py-6 px-6 md:px-12'
            }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="HireHUB Logo" className="w-12 h-12 object-contain" />
                    <span className="text-2xl font-bold text-secondary tracking-tight">HireHUB</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-text-secondary hover:text-primary font-medium transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    <button
                        onClick={() => navigate('/auth')}
                        className="bg-primary hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-orange-500/20 active:scale-95"
                    >
                        Let's Go
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-secondary"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl p-4 flex flex-col gap-4 animate-fade-in overflow-hidden">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-text-secondary hover:text-primary font-medium py-2"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/auth');
                        }}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-medium w-full"
                    >
                        Let's Go
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
