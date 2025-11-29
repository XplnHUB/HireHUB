import React from 'react';
import { Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-secondary text-white pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">


                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <img src={logo} alt="HireHUB Logo" className="w-12 h-12 object-contain" />
                            <span className="text-2xl font-bold tracking-tight">HireHUB</span>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Empowering students and connecting them with their dream careers through simplified placement management.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors group" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors group" aria-label="X (formerly Twitter)">

                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors group" aria-label="Meta">

                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />

                                    <path d="M16.924 6.126c-1.174 0-2.26.326-3.156.879-.518.32-1.032.746-1.53 1.258-.498-.512-1.012-.938-1.53-1.258-.896-.553-1.982-.879-3.156-.879C4.24 6.126 2 8.27 2 12s2.24 5.874 5.552 5.874c1.174 0 2.26-.326 3.156-.879.518-.32 1.032-.746 1.53-1.258.498.512 1.012.938 1.53 1.258.896.553 1.982.879 3.156.879C20.76 17.874 23 15.73 23 12s-2.24-5.874-5.552-5.874zM7.552 15.73c-1.984 0-3.408-1.428-3.408-3.73s1.424-3.73 3.408-3.73c.884 0 1.668.326 2.304.879.636.553 1.068 1.29 1.068 2.851 0 1.56-.432 2.298-1.068 2.851-.636.553-1.42.879-2.304.879zm9.372 0c-.884 0-1.668-.326-2.304-.879-.636-.553-1.068-1.29-1.068-2.851 0-1.56.432-2.298 1.068-2.851.636-.553 1.42-.879 2.304-.879 1.984 0 3.408 1.428 3.408 3.73s-1.424 3.73-3.408 3.73z" fill="currentColor" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors group" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>


                    <div>
                        <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#features" className="text-gray-400 hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#how-it-works" className="text-gray-400 hover:text-primary transition-colors">How It Works</a></li>
                            <li><a href="#testimonials" className="text-gray-400 hover:text-primary transition-colors">Testimonials</a></li>
                        </ul>
                    </div>


                    <div>
                        <h4 className="text-lg font-bold mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Student Guide</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Recruiter Guide</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Placement Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Success Stories</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>


                    <div>
                        <h4 className="text-lg font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin size={20} className="text-primary shrink-0 mt-1" />
                                <span>Rajiv Gandhi Infotech Park,<br />Phase 1, Hinjewadi, Pune,<br />Maharashtra - 411057</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone size={20} className="text-primary shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail size={20} className="text-primary shrink-0" />
                                <span>xplnhub@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} XplnHub Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
