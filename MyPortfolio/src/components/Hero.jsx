import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail, Smartphone, Code2, Star, Users } from 'lucide-react';
import ProfileScreen from './ProfileScreen';
import CompilationAnimation from './CompilationAnimation';

const Hero = () => {
    // Check user's motion preference for accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Profile toggle state
    const [showProfile, setShowProfile] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);

    // Stagger container animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const floatAnimation = {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center relative z-10 pt-4 md:pt-8 pb-12">
            {/* Background Texture - Dot Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Animated gradient orbs - Respects prefers-reduced-motion */}
            <motion.div
                className="absolute top-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none"
                animate={!prefersReducedMotion ? {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                } : { opacity: 0.3 }}
                transition={{ duration: 5, repeat: prefersReducedMotion ? 0 : Infinity }}
            />
            <motion.div
                className="absolute bottom-20 left-1/4 w-64 h-64 bg-kotlin/10 rounded-full blur-[80px] pointer-events-none"
                animate={!prefersReducedMotion ? {
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2]
                } : { opacity: 0.2 }}
                transition={{ duration: 4, repeat: prefersReducedMotion ? 0 : Infinity }}
            />

            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)] relative z-10">

                {/* Text Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-bold font-mono mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                        OPEN FOR NEW PROJECTS
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-white"
                    >
                        Building{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
                            Native
                        </span>
                        <br className="hidden md:block" />
                        Experience.
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-text-muted mb-10 max-w-prose leading-relaxed font-light"
                        style={{ lineHeight: '1.65' }}
                    >
                        Android Domain Coordinator @ Innogeeks | 2nd Year CSE @ KIET | Building scalable, production-grade mobile applications with Kotlin, Jetpack Compose & Flutter.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
                        <Link
                            to="/projects"
                            className="group px-8 py-4 bg-accent hover:bg-accent-dark text-primary font-bold text-lg rounded-xl transition-all shadow-[0_4px_14px_0_rgba(61,220,132,0.39)] hover:shadow-[0_6px_20px_rgba(61,220,132,0.5)] hover:-translate-y-1 flex items-center gap-2 cursor-pointer-glow magnetic-btn"
                        >
                            View Portfolio
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/contact"
                            className="px-8 py-4 bg-secondary/50 hover:bg-secondary text-text border border-border hover:border-accent/40 rounded-xl font-bold text-lg transition-all hover-lift"
                        >
                            Contact Me
                        </Link>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div variants={itemVariants} className="flex items-center gap-4 mb-10">
                        <a
                            href="https://github.com/mahakaal2005"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-secondary/50 rounded-xl border border-border hover:border-accent/40 hover:bg-secondary transition-all hover-scale cursor-external group"
                        >
                            <Github className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/atul-kumar-singh-3a828332b/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-secondary/50 rounded-xl border border-border hover:border-accent/40 hover:bg-secondary transition-all hover-scale cursor-external group"
                        >
                            <Linkedin className="w-5 h-5 text-text-muted group-hover:text-blue-400 transition-colors" />
                        </a>
                        <a
                            href="mailto:atul.k.singh5002@gmail.com"
                            className="p-3 bg-secondary/50 rounded-xl border border-border hover:border-accent/40 hover:bg-secondary transition-all hover-scale cursor-pointer-glow group"
                        >
                            <Mail className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                        </a>
                    </motion.div>

                    {/* Stats / Highlights - REAL DATA */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-2 gap-6 border-t border-border pt-8"
                    >
                        <motion.div
                            whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
                            className="group cursor-pointer"
                        >
                            <Smartphone className="w-6 h-6 text-accent mb-2" />
                            <div className="font-mono text-xl font-bold text-white">3+</div>
                            <div className="text-sm text-text-muted">Production Apps</div>
                        </motion.div>
                        <motion.div
                            whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
                            className="group cursor-pointer"
                        >
                            <Users className="w-6 h-6 text-purple-400 mb-2" />
                            <div className="font-mono text-xl font-bold text-white">200+</div>
                            <div className="text-sm text-text-muted">Students Mentored</div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* 3D Phone Mockup */}
                <motion.div
                    initial={{ opacity: 0, rotateY: -30, rotateX: 10, scale: 0.9 }}
                    animate={{ opacity: 1, rotateY: -12, rotateX: 5, scale: 1 }}
                    whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
                    transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
                    className="relative hidden lg:block perspective-1000 z-50 w-fit mx-auto"
                    style={{ perspective: '1000px' }}
                >
                    <motion.div
                        animate={floatAnimation}
                        className="relative w-[340px] h-auto aspect-[9/19] bg-secondary border-8 border-[#303440] rounded-[3rem] shadow-2xl mx-auto transform preserve-3d z-50"
                    >
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-[#303440] rounded-b-2xl z-20"></div>

                        {/* Screen Content — overflow-hidden clips blur & rounded corners */}
                        <div className="absolute inset-0 bg-primary rounded-[2.5rem] overflow-hidden">

                            {/* Status Bar — inside overflow-hidden so blur is clipped to screen shape */}
                            <div className={`absolute top-0 left-0 right-0 h-14 flex justify-between items-end pb-1.5 px-6 text-[10px] text-text-muted z-[60] pointer-events-none ${!showProfile ? 'bg-gradient-to-b from-primary/70 to-transparent' : ''}`}>
                                <span>9:41</span>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 bg-current rounded-full opacity-20"></div>
                                    <div className="w-3 h-3 bg-current rounded-full opacity-20"></div>
                                    <div className="w-3 h-3 bg-current opacity-80 rounded-sm"></div>
                                </div>
                            </div>

                            {/* Code view top fade — lives OUTSIDE the scroll wrapper so it stays fixed within the phone screen */}
                            {!showProfile && (
                                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-primary via-primary/70 to-transparent z-50 pointer-events-none" />
                            )}

                            {/* Inner scroll wrapper */}
                            <div className="w-full h-full overflow-y-auto no-scrollbar">
                                <AnimatePresence mode="wait">
                                    {!showProfile ? (
                                        <motion.div
                                            key="code"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full flex flex-col pt-20 px-4"
                                        >

                                            {/* Code Snippet as "App Content" */}
                                            <div className="flex-grow font-mono text-xs leading-relaxed text-text-muted relative">
                                                {/* Condensed DeveloperProfile Code */}
                                                <div className="space-y-1">
                                                    <div className="text-purple-400">@Composable</div>
                                                    <div className="text-yellow-400">fun <span className="text-blue-400">DeveloperProfile</span>() {'{'}</div>
                                                    <div className="pl-4 text-purple-400">Column(</div>
                                                    <div className="pl-8 text-orange-400">modifier = Modifier</div>
                                                    <div className="pl-12 text-orange-400">.fillMaxSize()</div>
                                                    <div className="pl-12 text-orange-400">.background(<span className="text-purple-400">Color</span>(<span className="text-green-400">0xFF0F111A</span>))</div>
                                                    <div className="pl-4 text-text">) {'{'}</div>

                                                    <div className="pl-8 text-text-muted mt-2">// Profile Header</div>
                                                    <div className="pl-8 text-yellow-400">ProfileHeader(</div>
                                                    <div className="pl-12 text-orange-400">name = <span className="text-green-400">"Atul Kumar"</span>,</div>
                                                    <div className="pl-12 text-orange-400">username = <span className="text-green-400">"@mahakaal2005"</span>,</div>
                                                    <div className="pl-12 text-orange-400">imageUrl = <span className="text-green-400">"profile.jpg"</span></div>
                                                    <div className="pl-8 text-text">)</div>

                                                    <div className="pl-8 text-text-muted mt-2">// Bio Section</div>
                                                    <div className="pl-8 text-yellow-400">BioSection(</div>
                                                    <div className="pl-12 text-orange-400">role = <span className="text-green-400">"Android Developer"</span>,</div>
                                                    <div className="pl-12 text-orange-400">education = <span className="text-green-400">"2nd Year CSE @ KIET"</span>,</div>
                                                    <div className="pl-12 text-orange-400">organization = <span className="text-green-400">"Innogeeks"</span></div>
                                                    <div className="pl-8 text-text">)</div>

                                                    <div className="pl-8 text-text-muted mt-2">// Stats Grid</div>
                                                    <div className="pl-8 text-yellow-400">StatsRow(</div>
                                                    <div className="pl-12 text-orange-400">stats = <span className="text-blue-400">listOf</span>(</div>
                                                    <div className="pl-16 text-yellow-400">Stat(<span className="text-green-400">"3+"</span>, <span className="text-green-400">"Production Apps"</span>),</div>
                                                    <div className="pl-16 text-yellow-400">Stat(<span className="text-green-400">"200+"</span>, <span className="text-green-400">"Mentoring"</span>),</div>
                                                    <div className="pl-16 text-yellow-400">Stat(<span className="text-green-400">"15+"</span>, <span className="text-green-400">"GitHub Stars"</span>)</div>
                                                    <div className="pl-12 text-text">)</div>
                                                    <div className="pl-8 text-text">)</div>

                                                    <div className="pl-8 text-text-muted mt-2">// Pinned Repos</div>
                                                    <div className="pl-8 text-yellow-400">PinnedRepositories(...)</div>
                                                    <div className="pl-4 text-text">{'}'}</div>
                                                    <div className="text-text">{'}'}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="profile"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full"
                                        >
                                            <ProfileScreen />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Compilation Animation Overlay */}
                                <AnimatePresence>
                                    {isCompiling && (
                                        <CompilationAnimation
                                            onComplete={() => {
                                                setIsCompiling(false);
                                                setShowProfile(!showProfile);
                                            }}
                                        />
                                    )}
                                </AnimatePresence>

                            </div>{/* end inner scroll wrapper */}

                        </div>{/* end screen content */}

                        {/* Floating Action Button — outside scroll container, fixed to phone frame */}
                        <motion.button
                            onClick={() => setIsCompiling(true)}
                            animate={!prefersReducedMotion ? {
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    "0 4px 20px rgba(61, 220, 132, 0.3)",
                                    "0 8px 30px rgba(61, 220, 132, 0.5)",
                                    "0 4px 20px rgba(61, 220, 132, 0.3)"
                                ]
                            } : {}}
                            transition={{ duration: 2, repeat: prefersReducedMotion ? 0 : Infinity }}
                            className="absolute bottom-8 right-6 px-4 py-3 bg-accent rounded-xl shadow-xl flex items-center gap-2 cursor-pointer hover:bg-accent-dark transition-all z-[60] group"
                        >
                            <span className="text-primary font-bold text-sm">
                                {showProfile ? 'Code' : 'Compile'}
                            </span>
                            <ArrowRight className="text-primary w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </motion.button>
                    </motion.div>
                    {/* Shadow Reflection */}
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-black/40 blur-3xl rounded-full pointer-events-none"></div>
                </motion.div>
            </div>
        </section >
    );
};

export default Hero;
