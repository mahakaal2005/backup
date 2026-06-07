import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Heart, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Projects', path: '/projects' },
        { name: 'Contact', path: '/contact' },
    ];

    const socialLinks = [
        { icon: <Github className="w-4 h-4" />, href: 'https://github.com/mahakaal2005', label: 'GitHub' },
        { icon: <Linkedin className="w-4 h-4" />, href: 'https://linkedin.com/in/atulkumarsingh5002', label: 'LinkedIn' },
        { icon: <Mail className="w-4 h-4" />, href: 'mailto:atul.k.singh5002@gmail.com', label: 'Email' },
    ];

    return (
        <footer className="border-t border-white/5 relative overflow-hidden">
            {/* Glow accent at top edge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

            <div className="container mx-auto px-6 py-16 relative z-10">
                {/* Main footer body — centered stack */}
                <div className="flex flex-col items-center text-center gap-8">

                    {/* Brand + tagline */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl font-bold tracking-tight">
                            Atul<span className="text-accent">Kumar</span>
                        </span>
                        <p className="text-text-muted text-sm max-w-xs leading-relaxed">
                            Building production-grade Android apps with Kotlin & Jetpack Compose.
                        </p>
                    </div>

                    {/* Nav links */}
                    <nav className="flex items-center gap-6 flex-wrap justify-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-sm text-text-muted hover:text-accent transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Social icons */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2.5 bg-white/5 rounded-lg border border-white/10 text-text-muted hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all"
                                aria-label={social.label}
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </div>

                    {/* Hire me CTA */}
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-1.5 text-sm text-accent/70 hover:text-accent transition-colors font-mono"
                    >
                        Open to freelance & full-time roles
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Divider */}
                <div className="mt-12 pt-6 border-t border-white/5 flex flex-col justify-center items-center gap-3 text-text-muted/50 text-xs">
                    <span>
                        © {currentYear} Atul Kumar Singh. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
