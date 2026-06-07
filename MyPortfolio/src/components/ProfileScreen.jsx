import React from 'react';
import { motion } from 'framer-motion';
import { Code, GraduationCap, Building2, Smartphone, Users, Star, Github } from 'lucide-react';
import profilePhoto from '../assets/profile_photo.png';

const ProfileScreen = () => {
    const stats = [
        { icon: Smartphone, value: "3+", label: "Apps" },
        { icon: Users, value: "200+", label: "Mentoring" },
        { icon: Star, value: "15+", label: "Stars" }
    ];

    const repos = [
        { name: "FluenceApp", description: "FinTech Dashboard", language: "Dart", languageColor: "#00B4AB", stars: 8 },
        { name: "Job-app", description: "Job Portal • Flutter", language: "Dart", languageColor: "#00B4AB", stars: 5 },
        { name: "Health-Assistant", description: "Health Tracker • Kotlin", language: "Kotlin", languageColor: "#7F52FF", stars: 3 }
    ];

    return (
        <div className="w-full h-full bg-primary overflow-y-auto no-scrollbar">
            {/* Header Section with Gradient */}
            <div className="relative bg-gradient-to-b from-secondary to-primary flex flex-col items-center pt-14 pb-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-center"
                >
                    {/* Profile Photo */}
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full border-[3px] border-accent bg-secondary overflow-hidden">
                        <img
                            src={profilePhoto}
                            alt="Atul Kumar"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Name */}
                    <h2 className="text-2xl font-bold text-white mb-1">Atul Kumar</h2>

                    {/* Username */}
                    <p className="text-sm text-text-muted">@mahakaal2005</p>
                </motion.div>
            </div>

            {/* Bio Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mx-4 mt-2 mb-4 bg-secondary rounded-2xl border border-border p-4 space-y-2"
            >
                <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-accent" />
                    <span className="text-sm text-white font-medium">Android Developer</span>
                </div>
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-kotlin" />
                    <span className="text-sm text-text-muted">2nd Year CSE @ KIET</span>
                </div>
                <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-accent-light" />
                    <span className="text-sm text-text-muted">Innogeeks</span>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-3 mx-4 mb-4"
            >
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-secondary rounded-xl border border-border p-3 text-center"
                    >
                        <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-[11px] text-text-muted leading-tight">{stat.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* Pinned Repositories */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mx-4 mb-4"
            >
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    📌 Pinned Repositories
                </h3>

                <div className="space-y-2">
                    {repos.map((repo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="bg-secondary rounded-xl border border-border p-3"
                        >
                            <div className="flex items-start justify-between mb-1">
                                <h4 className="text-sm font-bold text-accent">{repo.name}</h4>
                                <div className="flex items-center gap-1 text-text-muted">
                                    <Star className="w-3 h-3" />
                                    <span className="text-[11px]">{repo.stars}</span>
                                </div>
                            </div>
                            <p className="text-xs text-text-muted mb-2 leading-relaxed">{repo.description}</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: repo.languageColor }}
                                    />
                                    <span className="text-[11px] text-text-muted">{repo.language}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileScreen;
