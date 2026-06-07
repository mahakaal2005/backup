import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    disabled = false,
    type = 'button',
    icon: Icon
}) => {
    const variants = {
        primary: "bg-accent-primary text-bg-primary hover:bg-accent-secondary hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] border-transparent",
        secondary: "bg-white/5 text-white hover:bg-white/10 border-white/10 backdrop-blur-sm border",
        outline: "bg-transparent border-white/20 text-white hover:bg-white/5 border",
        gradient: "text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] border-transparent"
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "relative px-6 py-3 rounded-xl font-semibold transition-all duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                "flex items-center justify-center gap-2 shadow-lg",
                variants[variant],
                className
            )}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </motion.button>
    );
};

export default Button;
