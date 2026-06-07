import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Smartphone, Code2, Briefcase, ArrowRight } from 'lucide-react';

const Projects = () => {
    const projects = [
        {
            id: "fintech-dashboard",
            title: "FinTech Dashboard",
            category: "Flutter • BLoC",
            icon: <Briefcase className="w-5 h-5 text-accent" />,
            description: "Cross-platform fintech management hub for cashback rewards, social features & merchant services. Complete production-grade solution.",
            tags: ["Flutter", "Dart", "BLoC", "Firebase"],
            github: "https://github.com/mahakaal2005/FluenceApp",
            isFreelance: true
        },
        {
            id: "jobapp-portal",
            title: "JobApp Portal",
            category: "Flutter • Provider",
            icon: <Code2 className="w-5 h-5 text-cyan-400" />,
            description: "Complete job portal with dual roles, real-time chat & optimized search. Google Sign-In and Cloudinary integration.",
            tags: ["Flutter", "Firebase", "Provider", "Cloudinary"],
            github: "https://github.com/mahakaal2005/Job-app",
            isFreelance: false
        },
        {
            id: "health-assistant",
            title: "Health Assistant",
            category: "Native Android • Kotlin",
            icon: <Smartphone className="w-5 h-5 text-green-400" />,
            description: "Android health tracker with step counting, prescriptions & Gemini AI summaries. Native MVVM architecture.",
            tags: ["Kotlin", "Android", "MVVM", "Gemini"],
            github: "https://github.com/mahakaal2005/Health-Assistant",
            isFreelance: false
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <section id="projects" className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 blur-[120px] -z-10 pointer-events-none"
            />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
                >
                    <div>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "auto" }}
                            viewport={{ once: true }}
                            className="text-accent font-mono text-sm tracking-wider mb-2 overflow-hidden"
                        >
                            PORTFOLIO
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Featured{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
                                Work
                            </span>
                        </h2>
                    </div>
                    <p className="text-text-muted text-lg max-w-md leading-relaxed">
                        Real-world applications built for clients and personal projects.
                        Clean architecture, production-ready code.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                            className="group relative bg-secondary rounded-3xl border border-border overflow-hidden hover:border-accent/40 transition-all duration-300 flex flex-col h-full hover-glow cursor-pointer-glow"
                        >
                            {/* Freelance Badge */}
                            {project.isFreelance && (
                                <div className="absolute top-4 right-4 z-30">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                                        className="px-3 py-1 bg-accent/20 backdrop-blur-md rounded-full border border-accent/30 text-accent text-xs font-bold"
                                    >
                                        FREELANCE
                                    </motion.div>
                                </div>
                            )}

                            {/* Image Header - Gradient Placeholder */}
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary via-secondary to-surface">
                                {/* Animated code pattern background */}
                                <div className="absolute inset-0 opacity-35">
                                    <div className="absolute top-4 left-4 font-mono text-xs text-accent space-y-1">
                                        <div>@Composable</div>
                                        <div>fun {project.title.replace(/\s/g, '')}() {'{'}</div>
                                        <div className="pl-4 text-text-muted">// Production code</div>
                                        <div>{'}'}</div>
                                    </div>
                                </div>

                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity z-10" />

                                {/* Category Tag */}
                                <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                                    <div className="px-3 py-1.5 bg-primary/90 backdrop-blur-md rounded-lg border border-white/10 text-xs font-mono text-accent flex items-center gap-2 group-hover:border-accent/40 transition-colors">
                                        {project.icon}
                                        {project.category}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors text-underline-animate">
                                        {project.title}
                                    </h3>
                                </div>

                                {project.client && (
                                    <div className="text-sm text-text-muted mb-2">
                                        Client: <span className="text-accent">{project.client}</span>
                                    </div>
                                )}

                                <p className="text-text-muted text-sm leading-relaxed mb-6 flex-grow">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map((tag, idx) => (
                                        <motion.span
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(61, 220, 132, 0.2)" }}
                                            className="text-xs px-2.5 py-1 bg-primary rounded-md text-text-muted border border-white/5 font-mono transition-all"
                                        >
                                            {tag}
                                        </motion.span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="flex-1 py-2.5 rounded-lg bg-accent/10 text-accent text-sm font-bold hover:bg-accent hover:text-primary transition-all flex items-center justify-center gap-2 group/btn magnetic-btn"
                                    >
                                        <span>View Details</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 rounded-lg bg-primary text-text-muted hover:text-white hover:bg-white/5 transition-all border border-white/5 hover:border-accent/40 cursor-external group/github"
                                    >
                                        <Github className="w-5 h-5 group-hover/github:rotate-12 transition-transform" />
                                    </a>
                                </div>
                            </div>

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-kotlin/5" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Projects Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-secondary/50 hover:bg-secondary border border-border hover:border-accent/40 rounded-xl text-text hover:text-accent font-bold transition-all hover-lift cursor-pointer-glow"
                    >
                        <span>View All Projects</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
