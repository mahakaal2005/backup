import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const Input = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    className = "",
    error,
    icon: Icon,
    inputClassName
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {label && (
                <label className={cn(
                    "text-base font-medium transition-colors duration-200",
                    focused ? "text-accent-primary" : "text-text-secondary"
                )}>
                    {label}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <Icon className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200",
                        focused ? "text-accent-primary" : "text-text-secondary"
                    )} />
                )}

                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full bg-bg-card border rounded-xl py-3 text-text-primary placeholder:text-text-secondary/50",
                        "focus:outline-none transition-all duration-300",
                        Icon ? "pl-11 pr-4" : "px-4",
                        error
                            ? "border-error focus:border-error focus:ring-1 focus:ring-error"
                            : "border-white/10 focus:border-accent-primary/50",
                        inputClassName
                    )}
                />
            </div>

            {error && (
                <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-error font-medium"
                >
                    {error}
                </motion.span>
            )}
        </div>
    );
};

export default Input;
