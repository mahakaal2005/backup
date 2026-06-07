import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Github, Linkedin, CheckCircle, Loader2 } from 'lucide-react';

const Contact = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const contactInfo = [
        {
            icon: <Mail className="w-6 h-6" />,
            label: "Email",
            value: "atul.k.singh5002@gmail.com",
            href: "mailto:atul.k.singh5002@gmail.com",
            color: "text-accent"
        },
        {
            icon: <Phone className="w-6 h-6" />,
            label: "Phone",
            value: "+91-9336474830",
            href: "tel:+919336474830",
            color: "text-accent"
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            label: "Location",
            value: "Ghaziabad, India",
            href: null,
            color: "text-accent"
        }
    ];

    const socialLinks = [
        {
            icon: <Github className="w-6 h-6" />,
            href: "https://github.com/mahakaal2005",
            label: "GitHub",
            hoverColor: "hover:text-white hover:bg-[#333]"
        },
        {
            icon: <Linkedin className="w-6 h-6" />,
            href: "https://www.linkedin.com/in/atul-kumar-singh-3a828332b/",
            label: "LinkedIn",
            hoverColor: "hover:text-white hover:bg-[#0077b5]"
        }
    ];

    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            {/* Background gradient */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, 20, 0]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-1/2 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"
            />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-6">
                        Get In <span className="text-accent">Touch</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-2xl mx-auto">
                        Ready to start your next Android project? Let's discuss how I can help bring your ideas to life.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto"
                >
                    {/* Contact Info */}
                    <motion.div variants={itemVariants} className="space-y-8">
                        <div className="glass-panel p-8 rounded-2xl hover-glow">
                            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                {contactInfo.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-4 group cursor-pointer-glow"
                                    >
                                        <div className={`p-3 bg-accent/10 rounded-lg ${item.color} group-hover:bg-accent/20 transition-colors`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-sm text-text-muted">{item.label}</div>
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    className="font-medium text-text hover:text-accent transition-colors text-underline-animate"
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <div className="font-medium">{item.value}</div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="glass-panel p-8 rounded-2xl">
                            <h3 className="text-xl font-bold mb-4">Connect With Me</h3>
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`p-4 bg-primary rounded-xl border border-border text-text-muted transition-all cursor-external ${social.hoverColor}`}
                                        aria-label={social.label}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div variants={itemVariants}>
                        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Name</label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="text"
                                    required
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    className="w-full bg-primary/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all text-white placeholder:text-text-muted/60"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="email"
                                    required
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    className="w-full bg-primary/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all text-white placeholder:text-text-muted/60"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Message</label>
                                <motion.textarea
                                    whileFocus={{ scale: 1.01 }}
                                    rows="4"
                                    required
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    className="w-full bg-primary/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all text-white resize-none placeholder:text-text-muted/60"
                                    placeholder="Tell me about your project..."
                                ></motion.textarea>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isSubmitting || isSubmitted}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-accent hover:bg-accent-dark text-primary rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer-glow magnetic-btn shadow-[0_4px_14px_0_rgba(61,220,132,0.39)] hover:shadow-[0_6px_20px_rgba(61,220,132,0.5)]"
                            >
                                <AnimatePresence mode="wait">
                                    {isSubmitting ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </motion.div>
                                    ) : isSubmitted ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-primary"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Message Sent!
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="default"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            Send Message <Send className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
