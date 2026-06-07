import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../utils/cn';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    actions,
    variant = 'default'
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "w-full max-w-md rounded-2xl border p-6 shadow-2xl relative overflow-hidden",
                                "bg-[#0F1115] border-white/10"
                            )}
                        >
                            {/* Background Glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-primary/5 rounded-full blur-3xl" />

                            {/* Header */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <h3 className="text-xl font-bold text-white leading-tight">
                                    {title}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-1 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="text-text-secondary mb-8 relative z-10">
                                {children}
                            </div>

                            {/* Actions */}
                            {actions && (
                                <div className="flex justify-end gap-3 relative z-10">
                                    {actions}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
