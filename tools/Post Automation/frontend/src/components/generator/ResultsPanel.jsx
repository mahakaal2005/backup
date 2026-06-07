import React from 'react';
import { SparklesIcon, ClipboardDocumentIcon, BookmarkIcon, CheckIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '../../api/client';
import Card from '../Card';
import Button from '../Button';

export default function ResultsPanel({
    generatedPosts,
    loading,
    activePlatform,
    setActivePlatform,
    copyToClipboard,
    handleSave,
    savedPosts
}) {
    // Fetch Config for YouTube Handle/URL
    const { data: config } = useQuery({
        queryKey: ['config'],
        queryFn: () => api.getConfig(),
    });

    const handlePost = async (content) => {
        try {
            await navigator.clipboard.writeText(content);
            toast.success('Content copied to clipboard!', { icon: '📋' });

            // Open LinkedIn in new tab with pre-filled text
            const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(content)}`;
            window.open(linkedInUrl, '_blank');

            toast('Paste into LinkedIn to publish.', {
                icon: '👉',
                duration: 5000,
                position: 'bottom-center'
            });
        } catch (err) {
            console.error('Failed to copy', err);
            toast.error('Failed to copy content');
        }
    };

    const handleYouTubePost = async (content) => {
        // Smart Link Logic: Copy + Open Community Tab
        try {
            await navigator.clipboard.writeText(content);
            toast.success('Content copied to clipboard!', {
                icon: '📋',
                duration: 4000
            });

            // Determine URL: Use Handle/URL if available, else Studio fallback
            let targetUrl = 'https://studio.youtube.com/';
            const userUrl = config?.youtube_community_url || config?.youtube_handle; // Support legacy key if transient

            if (userUrl) {
                if (userUrl.includes('youtube.com')) {
                    // It's likely a full URL
                    targetUrl = userUrl;
                } else {
                    // It's a handle
                    const handle = userUrl.startsWith('@') ? userUrl : `@${userUrl}`;
                    targetUrl = `https://www.youtube.com/${handle}/community`;
                }
            }

            // Open in new tab
            window.open(targetUrl, '_blank');

            toast('Paste into the Community Tab to publish.', {
                icon: '👉',
                duration: 5000,
                position: 'bottom-center'
            });
        } catch (err) {
            console.error('Failed to copy keys', err);
            toast.error('Failed to copy content');
        }
    };

    return (
        <div className="col-span-8 flex flex-col gap-8">
            {generatedPosts ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col h-full gap-8 relative"
                >
                    {/* Loading Overlay for Regeneration */}
                    {loading && (
                        <div className="absolute inset-0 z-50 bg-bg-primary/50 backdrop-blur-[2px] rounded-3xl border-2 border-accent-primary/30 flex items-center justify-center transition-all duration-300">
                            <div className="flex flex-col items-center p-8 bg-bg-secondary/90 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
                                <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-white font-bold text-lg animate-pulse">Refining Content...</p>
                                <p className="text-text-secondary text-sm mt-2">Applying new settings</p>
                            </div>
                        </div>
                    )}
                    <div className="flex bg-white/5 p-1.5 rounded-2xl w-fit border border-white/10 self-start backdrop-blur-sm">
                        <button
                            onClick={() => setActivePlatform('linkedin')}
                            className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${activePlatform === 'linkedin' ? 'bg-[#0077b5] text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                        >
                            LinkedIn
                        </button>
                        <button
                            onClick={() => setActivePlatform('youtube')}
                            className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${activePlatform === 'youtube' ? 'bg-[#FF0000] text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                        >
                            YouTube
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar pb-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePlatform}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {generatedPosts[activePlatform].map((post, i) => (
                                    <Card key={i} animate={false} className="group relative p-8" glass>
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="text-xs font-bold tracking-wider uppercase bg-white/10 px-3 py-1.5 rounded-md text-text-secondary border border-white/5">
                                                Option {i + 1}
                                            </span>
                                            <div className="flex gap-2 transition-opacity">
                                                <Button
                                                    onClick={() => copyToClipboard(post)}
                                                    variant="secondary"
                                                    className="!px-4 !py-2 !text-xs"
                                                    icon={ClipboardDocumentIcon}
                                                >
                                                    Copy
                                                </Button>

                                                {activePlatform === 'linkedin' && (
                                                    <Button
                                                        onClick={() => handlePost(post)}
                                                        variant="primary"
                                                        className="!px-4 !py-2 !text-xs bg-[#0077b5] hover:bg-[#006097] border-0"
                                                        icon={PaperAirplaneIcon}
                                                    >
                                                        Post
                                                    </Button>
                                                )}

                                                {activePlatform === 'youtube' && (
                                                    <Button
                                                        onClick={() => handleYouTubePost(post)}
                                                        variant="primary"
                                                        className="!px-4 !py-2 !text-xs bg-[#FF0000] hover:bg-[#CC0000] border-0"
                                                        icon={PaperAirplaneIcon}
                                                    >
                                                        Post
                                                    </Button>
                                                )}

                                                <Button
                                                    onClick={() => handleSave(post, activePlatform, i)}
                                                    variant={savedPosts.has(`${activePlatform}-${i}`) ? "primary" : "secondary"}
                                                    className={`!px-4 !py-2 !text-xs ${savedPosts.has(`${activePlatform}-${i}`) ? 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30' : ''}`}
                                                    icon={savedPosts.has(`${activePlatform}-${i}`) ? BookmarkIconSolid : BookmarkIcon}
                                                >
                                                    {savedPosts.has(`${activePlatform}-${i}`) ? 'Saved' : 'Save'}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-text-primary whitespace-pre-wrap text-base leading-loose font-light">
                                                {post}
                                            </p>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-xs text-text-secondary/50 font-mono">
                                            <span>{post.length} characters</span>
                                            <span>{post.split(' ').length} words</span>
                                        </div>
                                    </Card>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            ) : (
                <div className="h-full flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl flex flex-col items-center justify-center text-text-secondary opacity-50 bg-white/5 rounded-3xl border-2 border-white/5 border-dashed p-12">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 relative">
                            <SparklesIcon className="w-12 h-12 text-white/20" />
                            {loading && (
                                <div className="absolute inset-0 rounded-full border-2 border-accent-primary border-t-transparent animate-spin"></div>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                            {loading ? 'Creating Magic...' : 'Ready to Generate'}
                        </h3>
                        <p className="max-w-lg text-center text-lg leading-relaxed">
                            {loading
                                ? 'Our AI is analyzing your video and crafting the perfect engagement hooks.'
                                : 'Start by pasting a YouTube URL to generate optimized posts for LinkedIn and YouTube.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
