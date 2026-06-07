import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ClockIcon, MagnifyingGlassIcon, FunnelIcon, TrashIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import PageTransition from '../components/PageTransition';
import { api } from '../api/client';

export default function History() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlatform, setFilterPlatform] = useState('all');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Fetch History with useQuery
    const { data: history = [], isLoading: loading, error } = useQuery({
        queryKey: ['history'],
        queryFn: () => api.getHistory(),
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => api.deleteHistory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['history'] });
            toast.success('Post deleted');
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        },
        onError: (err) => {
            console.error('Delete failed:', err);
            toast.error('Failed to delete item');
        }
    });

    if (error) {
        toast.error('Failed to load history');
    }

    const filteredHistory = history.filter(item => {
        const matchesSearch =
            item.video_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.generated_post?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlatform = filterPlatform === 'all' || item.platform === filterPlatform;
        return matchesSearch && matchesPlatform;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            deleteMutation.mutate(itemToDelete);
        }
    };

    return (
        <PageTransition>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">History</h1>
                    <p className="text-text-secondary mt-1">View and manage your past generations</p>
                </div>

                <div className="flex gap-4 items-end">
                    <Input
                        placeholder="Search history..."
                        className="flex-1"
                        icon={MagnifyingGlassIcon}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="w-[180px]">
                        <Select
                            value={filterPlatform}
                            onChange={(val) => setFilterPlatform(val)}
                            options={[
                                { value: 'all', label: 'All Platforms' },
                                { value: 'linkedin', label: 'LinkedIn' },
                                { value: 'youtube', label: 'YouTube' }
                            ]}
                        />
                    </div>
                </div>

                {
                    loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <AnimatePresence>
                                {filteredHistory.map((item, i) => (
                                    <Card
                                        key={item.id || i}
                                        animate={true}
                                        glass
                                        className="group hover:border-white/20 transition-all"
                                    >
                                        <div className="absolute -top-3 -right-3 flex gap-2 z-20">
                                            <button
                                                onClick={() => copyToClipboard(item.generated_post)}
                                                className="p-2.5 bg-bg-secondary hover:bg-accent-primary/10 text-white/40 hover:text-accent-primary rounded-xl transition-all duration-200 border border-white/5 hover:border-accent-primary/20 cursor-pointer shadow-lg"
                                                title="Copy to clipboard"
                                            >
                                                <ClipboardDocumentIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(item.id, e)}
                                                className="p-2.5 bg-bg-secondary hover:bg-red-500/10 text-white/40 hover:text-red-500 rounded-xl transition-all duration-200 border border-white/5 hover:border-red-500/20 cursor-pointer shadow-lg"
                                                title="Delete from history"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-4 min-w-0 w-full">
                                            <div className="flex justify-between items-start w-full">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded text-white ${item.platform === 'linkedin' ? 'bg-[#0077b5]' : 'bg-[#FF0000]'}`}>
                                                        {item.platform}
                                                    </span>
                                                    <span className="text-xs text-text-secondary flex items-center gap-1">
                                                        <ClockIcon className="w-3 h-3" />
                                                        {formatDate(item.created_at)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                {/* <img src={item.video_thumbnail || 'https://via.placeholder.com/150'} alt="" className="w-32 h-20 object-cover rounded-lg bg-white/5" /> */}
                                                <div className="flex-1 mr-12">
                                                    <h3 className="font-bold text-white mb-2 line-clamp-1">{item.video_title || 'Untitled Video'}</h3>
                                                    <p className="text-text-secondary text-sm line-clamp-2 font-light">{item.generated_post}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </AnimatePresence>

                            {filteredHistory.length === 0 && (
                                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                                    <p className="text-text-secondary">No history found matching your filters.</p>
                                </div>
                            )}
                        </div>
                    )
                }

                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Delete Post"
                    actions={
                        <>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-lg transition-all font-medium"
                            >
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </>
                    }
                >
                    <p>Are you sure you want to delete this generated post?</p>
                    <p className="text-xs mt-2 text-text-secondary/50">This action cannot be undone.</p>
                </Modal>
            </div>
        </PageTransition>
    );
}
