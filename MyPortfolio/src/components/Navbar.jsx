import React, { useState, useEffect } from 'react';
import { Menu, X, Smartphone, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Projects', path: '/projects' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => {
        return location.pathname === path ? 'text-accent font-medium' : 'text-text-muted hover:text-text';
    };

    const menuVariants = {
        closed: { opacity: 0, height: 0 },
        open: {
            opacity: 1,
            height: 'auto',
            transition: {
                duration: 0.3,
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const menuItemVariants = {
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 font-sans ${scrolled
                ? 'bg-primary/95 backdrop-blur-xl border-b border-border shadow-lg py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2 group">
                    <motion.div
                        whileHover={{ rotate: 10 }}
                        className="relative w-10 h-10 flex items-center justify-center bg-secondary rounded-xl border border-border group-hover:border-accent/50 transition-colors"
                    >
                        <Smartphone className="w-5 h-5 text-accent" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-surface rounded-full flex items-center justify-center border border-primary">
                            <Code className="w-2.5 h-2.5 text-kotlin" />
                        </div>
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight leading-none text-text">
                            Atul<span className="text-accent">Kumar</span>
                        </span>
                        <span className="text-[10px] text-text-muted uppercase tracking-widest leading-none mt-1">
                            Android Developer
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm tracking-wide transition-colors relative group py-2 ${isActive(link.path)}`}
                        >
                            <span className="text-underline-animate">{link.name}</span>
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}

                    <Link
                        to="/contact"
                        className="px-6 py-2.5 bg-accent text-primary font-bold text-sm tracking-wide rounded-lg hover:bg-accent-light transition-all shadow-[0_4px_14px_0_rgba(61,220,132,0.39)] hover:shadow-[0_6px_20px_rgba(61,220,132,0.5)] active:scale-95 cursor-pointer-glow magnetic-btn"
                    >
                        Let's Talk
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="md:hidden p-2 text-text hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu className="w-6 h-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="bg-primary/98 backdrop-blur-xl border-b border-border md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-2">
                            {navLinks.map((link) => (
                                <motion.div key={link.name} variants={menuItemVariants}>
                                    <Link
                                        to={link.path}
                                        className={`block p-4 rounded-xl text-lg font-medium transition-all ${location.pathname === link.path
                                            ? 'bg-secondary text-accent'
                                            : 'text-text-muted hover:bg-secondary/50 hover:text-text'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div variants={menuItemVariants}>
                                <Link
                                    to="/contact"
                                    className="mt-4 p-4 bg-accent text-primary text-center font-bold rounded-xl active:scale-95 transition-transform block shadow-[0_4px_14px_0_rgba(61,220,132,0.39)]"
                                >
                                    Let's Talk
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
