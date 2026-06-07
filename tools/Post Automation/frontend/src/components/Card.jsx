import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const Card = ({
    children,
    className = "",
    hover = false,
    glass = true,
    animate = true,
    onClick
}) => {
    const Wrapper = animate ? motion.div : 'div';

    return (
        <Wrapper
            onClick={onClick}
            initial={animate ? { opacity: 0, y: 20 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            whileHover={hover ? { y: -5, scale: 1.01 } : undefined}
            transition={{ duration: 0.3 }}
            className={cn(
                "rounded-2xl border p-6 relative overflow-hidden group",
                glass
                    ? "bg-white/5 border-white/10 backdrop-blur-xl"
                    : "bg-bg-secondary border-white/5",
                hover && "cursor-pointer hover:border-white/20 hover:shadow-2xl hover:shadow-accent-primary/10",
                className
            )}
        >
            {/* Dynamic gradient background on hover */}
            {hover && (
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 opacity-0 transition-opacity duration-500",
                    "group-hover:opacity-100"
                )} />
            )}

            {/* Content wrapper to stay above background */}
            <div className="relative z-10">
                {children}
            </div>
        </Wrapper>
    );
};

export default Card;
