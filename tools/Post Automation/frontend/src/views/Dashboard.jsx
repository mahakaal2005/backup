import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparklesIcon, FireIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { api } from '../api/client';

export default function Dashboard() {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');

    const { data: history = [] } = useQuery({
        queryKey: ['history'],
        queryFn: () => api.getHistory(),
    });

    const stats = useMemo(() => {
        const totalPosts = history.length;

        // Smart Time Formatting
        const totalMinutes = totalPosts * 15;
        let timeDisplay = "0m";
        if (totalMinutes > 0) {
            if (totalMinutes < 60) {
                timeDisplay = `${totalMinutes}m`;
            } else {
                timeDisplay = `${(totalMinutes / 60).toFixed(1)}h`;
            }
        }

        // Determine engagement based on tone distribution
        const toneCounts = history.reduce((acc, item) => {
            acc[item.tone] = (acc[item.tone] || 0) + 1;
            return acc;
        }, {});

        const dominantTone = Object.keys(toneCounts).reduce((a, b) => toneCounts[a] > toneCounts[b] ? a : b, 'Professional');

        let engagement = 'Start Creating';
        let engagementColor = 'text-white/40'; // Default for empty

        if (totalPosts > 0) {
            if (dominantTone === 'Professional') {
                engagement = 'Steady';
                engagementColor = 'text-blue-400';
            } else if (dominantTone === 'Casual') {
                engagement = 'High';
                engagementColor = 'text-emerald-400';
            } else if (dominantTone === 'Engaging') {
                engagement = 'Viral';
                engagementColor = 'text-purple-400';
            }
        }

        return { totalPosts, timeDisplay, engagement, engagementColor };
    }, [history]);

    const handleGenerateClick = () => {
        // Pass the URL to the Generator page via navigation state
        navigate('/generator', { state: { url } });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <PageTransition>
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-accent-primary/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent-secondary/5 rounded-full blur-[150px]" />
            </div>

            <div className="min-h-[calc(100vh-6rem)] flex flex-col justify-center gap-24 max-w-5xl mx-auto">
                {/* Hero Section */}
                <section className="text-center relative">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl font-bold mb-6 bg-gradient-to-r from-accent-primary via-white to-accent-secondary bg-clip-text text-transparent drop-shadow-2xl tracking-tight"
                    >
                        Turn Videos into <br /> Viral Posts
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Automatically generate engaging LinkedIn and YouTube Community posts from your video content using AI.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl mx-auto flex gap-3 p-2 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-300 focus-within:border-accent-primary/50 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                    >
                        <input
                            type="text"
                            placeholder="Paste your YouTube video URL..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 bg-transparent border-none px-4 py-3 text-lg focus:outline-none focus:ring-0 placeholder:text-text-secondary/50 text-white"
                        />
                        <Button
                            onClick={handleGenerateClick}
                            variant="gradient"
                            className="px-8 text-lg font-bold shadow-lg shadow-accent-primary/20"
                            icon={SparklesIcon}
                        >
                            Generate
                        </Button>
                    </motion.div>
                </section>

                {/* Stats */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <motion.div variants={item}>
                        <Card hover glass className="relative overflow-hidden group p-6">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FireIcon className="w-24 h-24 text-accent-primary" />
                            </div>
                            <div className="flex items-center gap-3 mb-2 text-accent-primary">
                                <FireIcon className="w-5 h-5" />
                                <h3 className="font-medium">Posts Generated</h3>
                            </div>
                            <p className="text-4xl font-bold text-white mb-1">{stats.totalPosts}</p>
                            <p className="text-base text-text-secondary">Total generated</p>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card hover glass className="relative overflow-hidden group p-6">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ClockIcon className="w-24 h-24 text-accent-secondary" />
                            </div>
                            <div className="flex items-center gap-3 mb-2 text-accent-secondary">
                                <ClockIcon className="w-5 h-5" />
                                <h3 className="font-medium">Time Saved</h3>
                            </div>
                            <p className="text-4xl font-bold text-white mb-1">{stats.timeDisplay}</p>
                            <p className="text-base text-text-secondary">avg. 15m per post</p>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card hover glass className="relative overflow-hidden group p-6">
                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${stats.engagementColor}`}>
                                <ChartBarIcon className="w-24 h-24" />
                            </div>
                            <div className={`flex items-center gap-3 mb-2 ${stats.engagementColor}`}>
                                <ChartBarIcon className="w-5 h-5" />
                                <h3 className="font-medium">Result Quality</h3>
                            </div>
                            <p className="text-4xl font-bold text-white mb-1">{stats.engagement}</p>
                            <p className="text-base text-text-secondary">Based on recent activity</p>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
