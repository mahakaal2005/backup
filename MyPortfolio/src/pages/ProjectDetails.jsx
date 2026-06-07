import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();

    // Placeholder data - in a real app, fetch based on ID
    const project = {
        title: "Project Title",
        description: "Detailed description of the project goes here. Explain the problem, solution, and technologies used.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        tech: ["React", "Tailwind", "Node.js"],
        features: [
            "Feature 1: Secure authentication",
            "Feature 2: Real-time data sync",
            "Feature 3: Responsive design"
        ]
    };

    return (
        <div className="pt-24 min-h-screen">
            <div className="container mx-auto px-6">
                <Link to="/projects" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div>
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full rounded-2xl shadow-2xl mb-8"
                        />
                        <div className="flex gap-4">
                            <a href="#" className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-white rounded-lg font-semibold transition-all flex items-center gap-2 border border-white/10">
                                <Github className="w-5 h-5" /> View Code
                            </a>
                            <a href="#" className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-semibold transition-all flex items-center gap-2">
                                <ExternalLink className="w-5 h-5" /> Live Demo
                            </a>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
                        <p className="text-text-muted text-lg mb-8 leading-relaxed">
                            {project.description}
                        </p>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.tech.map((t, i) => (
                                    <span key={i} className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-accent border border-accent/20">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">Key Features</h3>
                            <ul className="space-y-3">
                                {project.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-3 text-text-muted">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
