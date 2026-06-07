import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '../utils/cn';

const Select = ({
    label,
    options = [],
    value,
    onChange,
    className = "",
    placeholder = "Select an option",
    icon: Icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={cn("flex flex-col gap-2 relative", className)} ref={containerRef}>
            {label && (
                <label className="text-sm font-medium text-text-secondary">
                    {label}
                </label>
            )}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full bg-bg-card border rounded-xl py-3 pl-4 pr-10 text-text-primary cursor-pointer relative transition-all duration-300 select-none",
                    isOpen ? "border-accent-primary/50 ring-1 ring-accent-primary/50" : "border-white/10 hover:border-white/20",
                    Icon ? "pl-11" : ""
                )}
            >
                {Icon && (
                    <Icon className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200",
                        isOpen ? "text-accent-primary" : "text-text-secondary"
                    )} />
                )}

                <span className={cn("block truncate", !selectedOption && "text-text-secondary/50")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <ChevronDownIcon
                    className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary transition-transform duration-300",
                        isOpen && "rotate-180 text-accent-primary"
                    )}
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50 min-w-[200px]"
                    >
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl max-h-[250px] overflow-y-auto custom-scrollbar">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "px-4 py-3 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between",
                                        value === option.value
                                            ? "bg-accent-primary/10 text-accent-primary font-medium"
                                            : "text-text-secondary hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {option.label}
                                    {value === option.value && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Select;
