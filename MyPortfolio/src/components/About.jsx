import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Smartphone, Code2, Award } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: <Smartphone className="w-8 h-8 text-accent" />,
            title: "Android Native",
            description: "Building pixel-perfect apps with Kotlin, Jetpack Compose, and modern Android architecture patterns.",
            gradient: "from-accent/20 to-accent/5"
        },
        {
            icon: <Code2 className="w-8 h-8 text-purple-400" />,
            title: "Cross-Platform",
            description: "Delivering Flutter applications with BLoC pattern and clean architecture for scalability.",
            gradient: "from-purple-500/20 to-purple-500/5"
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-400" />,
            title: "Performance First",
            description: "Optimized code for smooth 60fps animations, efficient memory usage, and fast load times.",
            gradient: "from-yellow-500/20 to-yellow-500/5"
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
            title: "Secure Code",
            description: "Implementing industry-standard security practices with Firebase Auth and encrypted storage.",
            gradient: "from-blue-500/20 to-blue-500/5"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <section id="about" className="py-24 relative overflow-hidden">
            {/* Background decoration */}
            <motion.div
                animate={{
                    rotate: [0, 360],
                    opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/2 -right-1/2 w-full h-full border border-accent/10 rounded-full pointer-events-none"
            />
            <motion.div
                animate={{
                    rotate: [360, 0],
                    opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-1/2 -left-1/2 w-full h-full border border-kotlin/10 rounded-full pointer-events-none"
            />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6"
                    >
                        <Award className="w-5 h-5 text-accent" />
                        <span className="text-accent font-mono text-sm">Android Domain Coordinator @ Innogeeks</span>
                    </motion.div>

                    <h2 className="text-4xl font-bold mb-6">
                        About <span className="text-accent">Me</span>
                    </h2>
                    <p className="text-text-muted text-lg leading-relaxed">
                        2nd-year Computer Science student at KIET serving as Android Domain Coordinator @ Innogeeks.
                        Building scalable, production-grade mobile solutions while mentoring 200+ students in Android development through workshops and hackathons.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className={`glass-panel p-8 rounded-2xl hover:border-accent/30 transition-all group cursor-default bg-gradient-to-br ${feature.gradient}`}
                        >
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className="mb-6 p-4 bg-primary/50 rounded-xl inline-block"
                            >
                                {feature.icon}
                            </motion.div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-text-muted leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default About;
