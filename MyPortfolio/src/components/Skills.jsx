import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
    const technologies = [
        // Languages
        { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", color: "#007396" },
        { name: "Kotlin", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg", color: "#7F52FF" },
        { name: "Dart", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg", color: "#0175C2" },
        { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", color: "#A8B9CC" },

        // Mobile
        { name: "Android", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg", color: "#3DDC84" },
        { name: "Jetpack Compose", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jetpackcompose/jetpackcompose-original.svg", color: "#4285F4" },
        { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", color: "#02569B" },
        { name: "Postman", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg", color: "#FF6C37" },

        // Backend
        { name: "Spring Boot", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg", color: "#6DB33F" },
        { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", color: "#FFCA28" },
        { name: "Supabase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg", color: "#3ECF8E" },
        { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", color: "#4479A1" },

        // Tools
        { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", color: "#F05032" },
        { name: "Android Studio", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg", color: "#3DDC84" },
        { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", color: "#007ACC" },
        { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", color: "#FCC624" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const iconVariants = {
        hidden: { opacity: 0, scale: 0, rotateY: -180 },
        visible: {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
            }
        }
    };

    return (
        <section id="skills" className="py-24 relative overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">
                        Tech <span className="text-accent">Stack</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-xl mx-auto">
                        Technologies I use to build production-ready mobile applications
                    </p>
                </motion.div>

                {/* 3D Floating Icons Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-4xl mx-auto"
                >
                    {technologies.map((tech, index) => (
                        <motion.div
                            key={tech.name}
                            variants={iconVariants}
                            whileHover={{
                                scale: 1.2,
                                rotateY: 15,
                                rotateX: -10,
                                z: 50,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            className="group relative"
                            style={{ perspective: '1000px' }}
                        >
                            {/* Icon Container with 3D effect */}
                            <div
                                className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-secondary/80 backdrop-blur-sm border border-border 
                                           flex items-center justify-center cursor-pointer
                                           group-hover:border-opacity-50 group-hover:shadow-2xl
                                           transition-all duration-300 transform-gpu"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    boxShadow: `0 10px 30px -10px ${tech.color}20`
                                }}
                            >
                                {/* Glow effect on hover */}
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background: `radial-gradient(circle at center, ${tech.color}30 0%, transparent 70%)`,
                                    }}
                                />

                                {/* Tech Icon */}
                                <img
                                    src={tech.icon}
                                    alt={tech.name}
                                    className="w-10 h-10 md:w-12 md:h-12 relative z-10 drop-shadow-lg
                                               group-hover:drop-shadow-2xl transition-all duration-300"
                                    style={{
                                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
                                        transform: 'translateZ(20px)'
                                    }}
                                />

                                {/* Reflection effect */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-12 h-6 opacity-20 blur-sm">
                                    <img
                                        src={tech.icon}
                                        alt=""
                                        className="w-full h-full object-contain scale-y-[-1]"
                                    />
                                </div>
                            </div>

                            {/* Tooltip */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileHover={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 
                                           bg-surface rounded-lg text-xs font-medium text-text whitespace-nowrap
                                           opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                                           border border-border shadow-lg"
                            >
                                {tech.name}
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Focus areas text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-text-muted/60 text-xs uppercase tracking-widest font-mono">Focus Areas</p>
                        <div className="inline-flex items-center gap-4 flex-wrap justify-center">
                            <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent/20 cursor-default select-none">
                                Android Native
                            </span>
                            <span className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium border border-purple-500/20 cursor-default select-none">
                                Cross-Platform
                            </span>
                            <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20 cursor-default select-none">
                                Clean Architecture
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
