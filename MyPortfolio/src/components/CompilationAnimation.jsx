import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CompilationAnimation = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const steps = [
        { text: "$ kotlinc AtulKumar.kt", color: "#3DDC84", delay: 0 },
        { text: "Resolving dependencies...", color: "#B8BDC3", delay: 300 },
        { text: "Compiling 1 Kotlin source file", color: "#B8BDC3", delay: 600 },
        { text: "Building profile components...", color: "#B8BDC3", delay: 900 },
        { text: "✓ BUILD SUCCESSFUL", color: "#3DDC84", delay: 1200 },
        { text: "Launching DeveloperProfile()", color: "#7F52FF", delay: 1500 }
    ];

    useEffect(() => {
        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        // Step-by-step text animation
        steps.forEach((step, index) => {
            setTimeout(() => {
                setCurrentStep(index + 1);
                if (index === steps.length - 1) {
                    setTimeout(() => {
                        onComplete();
                    }, 300);
                }
            }, step.delay);
        });

        return () => clearInterval(progressInterval);
    }, []);

    return (
        <div className="absolute inset-0 bg-primary/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="w-full max-w-[280px] px-4">
                {/* Terminal Output */}
                <div className="font-mono text-xs space-y-2 mb-6">
                    <AnimatePresence>
                        {steps.slice(0, currentStep).map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ color: step.color }}
                            >
                                {step.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>

                {/* Percentage */}
                <div className="text-center mt-2 font-mono text-xs text-text-muted">
                    {progress}%
                </div>
            </div>
        </div>
    );
};

export default CompilationAnimation;
