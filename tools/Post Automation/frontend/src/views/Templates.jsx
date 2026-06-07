import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, TrashIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import PageTransition from '../components/PageTransition';
import { api } from '../api/client';

export default function Templates() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: '', prompt_text: '', tone: 'Professional', platform: 'both' });

    // Fetch Templates
    const { data: templates = [], isLoading: loading, error } = useQuery({
        queryKey: ['templates'],
        queryFn: () => api.getTemplates(),
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => api.deleteTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            toast.success('Template deleted');
        },
        onError: () => {
            toast.error('Failed to delete template');
        }
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: (template) => api.createTemplate(template),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            setShowModal(false);
            setNewTemplate({ name: '', prompt_text: '', tone: 'Professional', platform: 'both' });
            toast.success('Template created successfully');
        },
        onError: () => {
            toast.error('Failed to create template');
        }
    });

    if (error) {
        toast.error('Failed to load templates');
    }

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this template?')) return;
        deleteMutation.mutate(id);
    };

    const handleCreate = () => {
        if (!newTemplate.name || !newTemplate.prompt_text) {
            toast.error('Name and prompt text are required');
            return;
        }
        createMutation.mutate(newTemplate);
    };

    return (
        <PageTransition>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Templates</h1>
                        <p className="text-text-secondary mt-1">Manage your custom AI prompt templates</p>
                    </div>
                    <Button onClick={() => setShowModal(true)} icon={PlusIcon}>
                        New Template
                    </Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {templates.map((template) => (
                                <Card key={template.id} hover glass className="group flex flex-col justify-between h-full">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-2 bg-accent-secondary/10 rounded-lg">
                                                <DocumentTextIcon className="w-6 h-6 text-accent-secondary" />
                                            </div>
                                            <div className="flex gap-2">
                                                {template.platform !== 'both' && (
                                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white/5 rounded text-text-secondary">
                                                        {template.platform}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold mb-1">{template.name}</h3>
                                        <p className="text-text-secondary text-sm mb-4 line-clamp-3 font-light">
                                            {template.prompt_text}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                        <span className="text-xs text-text-secondary bg-white/5 px-2 py-1 rounded">
                                            {template.tone || 'Custom'}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(template.id)}
                                            className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </AnimatePresence>

                        {templates.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                                <DocumentTextIcon className="w-16 h-16 text-white/10 mb-4" />
                                <p className="text-text-secondary text-lg">No templates yet. Create your first one!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Create Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowModal(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg relative z-10 shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">New Template</h2>
                                    <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-white">
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        label="Template Name"
                                        placeholder="e.g., Viral LinkedIn Hook"
                                        value={newTemplate.name}
                                        onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                    />

                                    <div>
                                        <label className="text-sm font-medium text-text-secondary mb-2 block">Prompt Template</label>
                                        <textarea
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-text-primary focus:outline-none focus:border-accent-primary min-h-[150px]"
                                            placeholder="Write your custom instructions for the AI..."
                                            value={newTemplate.prompt_text}
                                            onChange={e => setNewTemplate({ ...newTemplate, prompt_text: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-secondary block">Tone</label>
                                            <select
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none"
                                                value={newTemplate.tone}
                                                onChange={e => setNewTemplate({ ...newTemplate, tone: e.target.value })}
                                            >
                                                <option value="Professional">Professional</option>
                                                <option value="Casual">Casual</option>
                                                <option value="Engaging">Engaging</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-secondary block">Platform</label>
                                            <select
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none"
                                                value={newTemplate.platform}
                                                onChange={e => setNewTemplate({ ...newTemplate, platform: e.target.value })}
                                            >
                                                <option value="both">Both</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="youtube">YouTube</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                        <Button
                                            onClick={handleCreate}
                                            loading={createMutation.isPending}
                                        >
                                            {createMutation.isPending ? 'Creating...' : 'Create Template'}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
}
