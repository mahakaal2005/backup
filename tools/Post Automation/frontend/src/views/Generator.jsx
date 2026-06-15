import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SparklesIcon, ArrowPathIcon, LinkIcon,
    ClipboardDocumentIcon, BookmarkIcon, PaperAirplaneIcon,
    AdjustmentsHorizontalIcon, ChevronDownIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import PageTransition from '../components/PageTransition';
import { api } from '../api/client';

// ─── Sub-components ─────────────────────────────────────────────────────────

function VideoPreviewCard({ videoData }) {
    return (
        <AnimatePresence>
            {videoData && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 mt-1"
                >
                    <img
                        src={videoData.thumbnail}
                        alt="Thumbnail"
                        className="w-24 h-16 object-cover rounded-xl shadow-lg flex-shrink-0"
                    />
                    <div className="overflow-hidden flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="font-semibold text-sm text-white truncate leading-tight mb-1">
                            {videoData.title}
                        </h3>
                        <p className="text-xs text-text-secondary truncate mb-2">{videoData.channelTitle}</p>
                        <div className="flex gap-1.5 flex-wrap">
                            {videoData.tags?.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded-full border border-accent-primary/20">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function ToneSelector({ tone, setTone }) {
    const tones = [
        { id: 'Professional', emoji: '💼', desc: 'Formal & authoritative' },
        { id: 'Casual', emoji: '😊', desc: 'Friendly & relaxed' },
        { id: 'Engaging', emoji: '🔥', desc: 'High energy & viral' },
        { id: 'Technical', emoji: '⚙️', desc: 'Detailed & precise' },
    ];
    return (
        <div className="grid grid-cols-2 gap-2">
            {tones.map(t => (
                <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setTone(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                        tone === t.id
                            ? 'bg-accent-primary/15 border-accent-primary/60 shadow-[0_0_12px_rgba(0,212,255,0.15)]'
                            : 'bg-white/3 border-white/8 hover:border-white/20 hover:bg-white/5'
                    }`}
                >
                    <div className="text-base mb-0.5">{t.emoji}</div>
                    <div className={`text-xs font-semibold ${tone === t.id ? 'text-accent-primary' : 'text-white'}`}>
                        {t.id}
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5">{t.desc}</div>
                </motion.button>
            ))}
        </div>
    );
}

function CountPicker({ label, value, onChange }) {
    return (
        <div>
            <label className="text-xs text-text-secondary font-medium block mb-2">{label}</label>
            <div className="flex gap-1.5">
                {[1, 2, 3].map(n => (
                    <button
                        key={n}
                        onClick={() => onChange(n)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                            value === n
                                ? 'bg-accent-primary text-bg-primary border-transparent shadow-[0_0_10px_rgba(0,212,255,0.3)]'
                                : 'bg-white/5 text-text-secondary border-white/10 hover:border-white/25 hover:text-white'
                        }`}
                    >
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
}

const MODEL_OPTIONS = [
    { group: '⚡ Fast & Free (Groq)', options: [
        { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', badge: 'Best Overall' },
        { value: 'moonshotai/kimi-k2-instruct-0905', label: 'Kimi K2', badge: '262k ctx' },
        { value: 'qwen/qwen3-32b', label: 'Qwen 3 32B', badge: 'Balanced' },
    ]},
    { group: '🧠 Google Gemini', options: [
        { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', badge: 'Smart' },
        { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', badge: 'Pro' },
    ]},
];

function ModelSelect({ model, onChange }) {
    return (
        <div className="relative">
            <select
                value={model}
                onChange={e => onChange(e.target.value)}
                className="w-full appearance-none bg-bg-secondary border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white focus:border-accent-primary/50 focus:outline-none transition-colors duration-200"
            >
                {MODEL_OPTIONS.map(group => (
                    <optgroup key={group.group} label={group.group}>
                        {group.options.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label} — {opt.badge}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
    );
}

// Left panel – all config
function ConfigPanel({
    url, setUrl, loading, handleFetchVideo,
    videoData, tone, setTone,
    model, setModel,
    linkedinCount, setLinkedinCount,
    youtubeCount, setYoutubeCount,
    linkInComments, setLinkInComments,
    handleGenerate,
}) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleFetchVideo();
    };

    return (
        <div className="w-full flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-white/10 flex items-center justify-center">
                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                    <h2 className="font-bold text-white text-base leading-tight">Configuration</h2>
                    <p className="text-xs text-text-secondary">Paste a video URL to get started</p>
                </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">YouTube URL</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="https://youtube.com/watch?v=..."
                            disabled={loading}
                            className="w-full bg-bg-secondary border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-text-secondary/50 focus:border-accent-primary/50 focus:outline-none transition-colors duration-200 disabled:opacity-60"
                        />
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleFetchVideo}
                        disabled={loading}
                        className="px-4 py-3 bg-accent-primary rounded-xl text-bg-primary font-semibold disabled:opacity-50 transition-all hover:bg-accent-secondary hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] flex-shrink-0"
                    >
                        <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </motion.button>
                </div>
                <VideoPreviewCard videoData={videoData} />
            </div>

            {/* Divider */}
            <div className="h-px bg-white/8" />

            {/* Tone */}
            <div className="space-y-3">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Tone</label>
                <ToneSelector tone={tone} setTone={setTone} />
            </div>

            {/* Divider */}
            <div className="h-px bg-white/8" />

            {/* AI Model */}
            <div className="space-y-3">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">AI Model</label>
                <ModelSelect model={model} onChange={setModel} />
            </div>

            {/* Divider */}
            <div className="h-px bg-white/8" />

            {/* Post count */}
            <div className="space-y-3">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Posts to Generate</label>
                <div className="grid grid-cols-2 gap-3">
                    <CountPicker label="LinkedIn" value={linkedinCount} onChange={setLinkedinCount} />
                    <CountPicker label="YouTube" value={youtubeCount} onChange={setYoutubeCount} />
                </div>

            {/* Divider */}
            <div className="h-px bg-white/8" />

            {/* LinkedIn Link Placement */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">LinkedIn Link</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setLinkInComments(false)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                            !linkInComments
                                ? 'bg-accent-primary/15 border-accent-primary/50 text-accent-primary'
                                : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20 hover:text-white'
                        }`}
                    >
                        In post
                    </button>
                    <button
                        onClick={() => setLinkInComments(true)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                            linkInComments
                                ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                                : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20 hover:text-white'
                        }`}
                    >
                        In comments
                    </button>
                </div>
                <p className="text-[10px] text-text-secondary/60 leading-relaxed">
                    {linkInComments
                        ? '⚠️ Link goes in first comment — better reach, needs manual step'
                        : 'Link included directly in post — simpler but may limit reach'}
                </p>
            </div>
            </div>

            {/* Generate button */}
            <motion.button
                whileHover={videoData && !loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(168,85,247,0.4)' } : {}}
                whileTap={videoData && !loading ? { scale: 0.98 } : {}}
                onClick={handleGenerate}
                disabled={!videoData || loading}
                className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 mt-2 ${
                    videoData && !loading
                        ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg cursor-pointer'
                        : 'bg-white/5 text-text-secondary border border-white/10 cursor-not-allowed'
                }`}
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating…
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        Generate Posts
                    </>
                )}
            </motion.button>
        </div>
    );
}

// Right panel – results
function ResultsPanel({ generatedPosts, loading, activePlatform, setActivePlatform, copyToClipboard, handleSave, savedPosts, config }) {
    const [pasteHint, setPasteHint] = React.useState(null); // { platform, postIndex }

    const showPasteHint = (platform, index) => {
        setPasteHint({ platform, index });
        setTimeout(() => setPasteHint(null), 8000);
    };

    const handleLinkedInPost = async (content, index) => {
        try {
            await navigator.clipboard.writeText(content);
            showPasteHint('linkedin', index);
            // Open LinkedIn's post composer — LinkedIn no longer supports ?text= URL params,
            // so we copy to clipboard and send the user to the composer
            window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank');
        } catch (err) {
            toast.error('Could not copy — please copy the text manually then open LinkedIn');
        }
    };

    const handleYouTubePost = async (content, index) => {
        try {
            await navigator.clipboard.writeText(content);
            showPasteHint('youtube', index);
            const userUrl = config?.youtube_community_url || config?.youtube_handle;
            let targetUrl = 'https://studio.youtube.com/channel/community';
            if (userUrl) {
                if (userUrl.includes('youtube.com')) {
                    targetUrl = userUrl.includes('/community') ? userUrl : `${userUrl}/community`;
                } else {
                    const handle = userUrl.startsWith('@') ? userUrl : `@${userUrl}`;
                    targetUrl = `https://www.youtube.com/${handle}/community`;
                }
            }
            window.open(targetUrl, '_blank');
        } catch (err) {
            toast.error('Could not copy — please copy the text manually then open YouTube Studio');
        }
    };

    if (!generatedPosts && !loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-sm">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-white/10 flex items-center justify-center mx-auto">
                        <SparklesIcon className="w-10 h-10 text-white/20" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Ready to Generate</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        Paste a YouTube URL on the left, configure your options, then hit <span className="text-accent-primary font-medium">Generate Posts</span>.
                    </p>
                </div>
            </div>
        );
    }

    if (loading && !generatedPosts) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-white/10 flex items-center justify-center mx-auto relative">
                        <SparklesIcon className="w-10 h-10 text-white/30" />
                        <div className="absolute inset-0 rounded-3xl border-2 border-accent-primary border-t-transparent animate-spin" />
                    </div>
                    <h3 className="text-xl font-bold text-white animate-pulse">Creating Magic…</h3>
                    <p className="text-text-secondary text-sm">AI is crafting your viral content</p>
                </div>
            </div>
        );
    }

    const posts = generatedPosts?.[activePlatform] || [];

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Platform tabs + loading overlay */}
            <div className="relative flex-shrink-0 mb-6">
                <div className="flex gap-2 bg-white/5 p-1 rounded-2xl w-fit border border-white/10">
                    <button
                        onClick={() => setActivePlatform('linkedin')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            activePlatform === 'linkedin'
                                ? 'bg-[#0077b5] text-white shadow-lg'
                                : 'text-text-secondary hover:text-white'
                        }`}
                    >
                        LinkedIn
                    </button>
                    <button
                        onClick={() => setActivePlatform('youtube')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            activePlatform === 'youtube'
                                ? 'bg-[#FF0000] text-white shadow-lg'
                                : 'text-text-secondary hover:text-white'
                        }`}
                    >
                        YouTube
                    </button>
                </div>
                {loading && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs text-accent-primary">
                        <div className="w-3 h-3 border border-accent-primary border-t-transparent rounded-full animate-spin" />
                        Refreshing…
                    </div>
                )}
            </div>

            {/* Posts list */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activePlatform}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {posts.map((post, i) => {
                            const saveKey = `${activePlatform}-${i}`;
                            const isSaved = savedPosts.has(saveKey);
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="bg-white/4 border border-white/10 rounded-2xl p-6 group hover:border-white/20 transition-all duration-200"
                                >
                                    {/* Card header */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold tracking-wider uppercase bg-white/10 px-2.5 py-1 rounded-lg text-text-secondary border border-white/5">
                                            Option {i + 1}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => copyToClipboard(post)}
                                                title="Copy"
                                                className="p-2 rounded-lg bg-white/5 text-text-secondary hover:text-white hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-200"
                                            >
                                                <ClipboardDocumentIcon className="w-4 h-4" />
                                            </button>
                                            {activePlatform === 'linkedin' && (
                                                <button
                                                    onClick={() => handleLinkedInPost(post, i)}
                                                    title="Open LinkedIn composer with this post copied"
                                                    className="px-3 py-2 rounded-lg bg-[#0077b5]/15 text-[#0077b5] hover:bg-[#0077b5] hover:text-white border border-[#0077b5]/30 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
                                                >
                                                    <PaperAirplaneIcon className="w-3.5 h-3.5" />
                                                    Post to LinkedIn
                                                </button>
                                            )}
                                            {activePlatform === 'youtube' && (
                                                <button
                                                    onClick={() => handleYouTubePost(post, i)}
                                                    title="Open YouTube Community composer with this post copied"
                                                    className="px-3 py-2 rounded-lg bg-[#FF0000]/15 text-[#FF0000] hover:bg-[#FF0000] hover:text-white border border-[#FF0000]/30 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
                                                >
                                                    <PaperAirplaneIcon className="w-3.5 h-3.5" />
                                                    Post to YouTube
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleSave(post, activePlatform, i)}
                                                title={isSaved ? 'Unsave' : 'Save'}
                                                className={`p-2 rounded-lg border transition-all duration-200 ${
                                                    isSaved
                                                        ? 'bg-green-500/15 text-green-400 border-green-500/40 hover:bg-green-500/25'
                                                        : 'bg-white/5 text-text-secondary hover:text-white hover:bg-white/10 border-white/5 hover:border-white/20'
                                                }`}
                                            >
                                                {isSaved
                                                    ? <BookmarkIconSolid className="w-4 h-4" />
                                                    : <BookmarkIcon className="w-4 h-4" />
                                                }
                                            </button>
                                        </div>
                                    </div>

                                    {/* Post body */}
                                    <p className="text-text-primary whitespace-pre-wrap text-sm leading-relaxed font-light">
                                        {post}
                                    </p>

                                    {/* Footer stats */}
                                    <div className="mt-5 pt-4 border-t border-white/5 flex justify-between text-[11px] text-text-secondary/50 font-mono">
                                        <span>{post.length} chars</span>
                                        <span>{post.split(/\s+/).filter(Boolean).length} words</span>
                                    </div>

                                    {/* Paste hint — appears for 8s after clicking Post */}
                                    <AnimatePresence>
                                        {pasteHint?.index === i && pasteHint?.platform === activePlatform && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -6, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                exit={{ opacity: 0, y: -6, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className={`mt-3 rounded-xl px-4 py-3 flex items-start gap-3 text-xs font-medium ${
                                                    activePlatform === 'linkedin'
                                                        ? 'bg-[#0077b5]/10 border border-[#0077b5]/30 text-[#5aafe8]'
                                                        : 'bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#ff6b6b]'
                                                }`}
                                            >
                                                <span className="text-base flex-shrink-0">📋</span>
                                                <div>
                                                    <div className="font-bold mb-0.5">Post text copied to clipboard</div>
                                                    <div className="opacity-80 leading-relaxed">
                                                        {activePlatform === 'linkedin'
                                                            ? <>LinkedIn just opened. Click <strong>"Start a post"</strong>, then press <kbd className="bg-white/10 px-1.5 py-0.5 rounded font-mono">Ctrl+V</kbd> to paste.</>  
                                                            : <>YouTube Studio opened. Click <strong>"Create post"</strong>, then press <kbd className="bg-white/10 px-1.5 py-0.5 rounded font-mono">Ctrl+V</kbd> to paste.</>  
                                                        }
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Main Generator view ─────────────────────────────────────────────────────

export default function Generator() {
    const location = useLocation();
    const queryClient = useQueryClient();

    const [url, setUrl] = useState('');
    const [activePlatform, setActivePlatform] = useState('linkedin');
    const [tone, setTone] = useState('Professional');
    const [model, setModel] = useState('llama-3.3-70b-versatile');
    const [linkedinCount, setLinkedinCount] = useState(1);
    const [youtubeCount, setYoutubeCount] = useState(1);
    const [linkInComments, setLinkInComments] = useState(false);

    const { data: videoData } = useQuery({
        queryKey: ['currentVideoData'],
        staleTime: Infinity,
        gcTime: 1000 * 60 * 30,
        initialData: null,
    });

    const { data: generatedPosts } = useQuery({
        queryKey: ['currentGeneratedPosts'],
        staleTime: Infinity,
        gcTime: 1000 * 60 * 30,
        initialData: null,
    });

    const { data: savedPostsArr = [] } = useQuery({
        queryKey: ['currentSavedPosts'],
        staleTime: Infinity,
        gcTime: 1000 * 60 * 30,
        initialData: [],
    });

    const { data: config } = useQuery({
        queryKey: ['config'],
        queryFn: () => api.getConfig(),
    });

    const savedPosts = React.useMemo(() => new Set(savedPostsArr), [savedPostsArr]);

    const videoMutation = useMutation({
        mutationFn: (videoUrl) => api.fetchVideo(videoUrl),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['currentVideoData'], { ...data, videoUrl: variables });
            toast.success('Video found!');
        },
        onError: () => toast.error('Could not find video. Check your YouTube API key in Settings.'),
    });

    const generateMutation = useMutation({
        mutationFn: (params) => api.generatePosts(params),
        onSuccess: (posts) => {
            queryClient.setQueryData(['currentGeneratedPosts'], posts);
            queryClient.setQueryData(['currentSavedPosts'], []);
            toast.success('Posts generated!');
        },
        onError: () => toast.error('Generation failed. Check your AI API key in Settings.'),
    });

    const saveMutation = useMutation({
        mutationFn: (params) => api.saveHistory(params),
        onSuccess: (_, variables) => {
            toast.success('Saved to history!');
            const key = `${variables.platform}-${variables.index}`;
            queryClient.setQueryData(['currentSavedPosts'], (old = []) => [...(old || []), key]);
        },
        onError: () => toast.error('Failed to save'),
    });

    useEffect(() => {
        if (location.state?.url) {
            setUrl(location.state.url);
            videoMutation.mutate(location.state.url);
        } else if (videoData?.videoUrl) {
            setUrl(videoData.videoUrl);
        }
    }, [location.state]);

    const handleFetchVideo = () => {
        if (!url.trim()) { toast.error('Please enter a YouTube URL'); return; }
        videoMutation.mutate(url.trim());
    };

    const handleGenerate = () => {
        if (!videoData) return;
        generateMutation.mutate({
            videoData: { ...videoData, url },
            tone,
            length: 'Medium',
            hashtags: videoData.tags,
            model,
            linkedinCount,
            youtubeCount,
            linkInComments,
        });
    };

    const handleSave = (postContent, platform, index) => {
        const key = `${platform}-${index}`;
        if (savedPosts.has(key)) {
            queryClient.setQueryData(['currentSavedPosts'], (old = []) => old.filter(k => k !== key));
            toast.success('Removed from bookmarks');
        } else {
            saveMutation.mutate({
                video_url: url,
                video_title: videoData?.title || 'Untitled',
                platform,
                generated_post: postContent,
                tone,
                index,
            });
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!', { icon: '📋' });
    };

    const isLoading = videoMutation.isPending || generateMutation.isPending;

    return (
        <PageTransition>
            {/* Full-height two column grid */}
            <div className="flex gap-6 min-h-[calc(100vh-6rem)]">

                {/* ── Left column: sticky config panel ── */}
                <aside className="w-80 flex-shrink-0">
                    <div className="sticky top-6">
                        <div className="bg-white/4 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                            <ConfigPanel
                                url={url}
                                setUrl={setUrl}
                                loading={isLoading}
                                handleFetchVideo={handleFetchVideo}
                                videoData={videoData}
                                tone={tone}
                                setTone={setTone}
                                model={model}
                                setModel={setModel}
                                linkedinCount={linkedinCount}
                                setLinkedinCount={setLinkedinCount}
                                youtubeCount={youtubeCount}
                                setYoutubeCount={setYoutubeCount}
                                linkInComments={linkInComments}
                                setLinkInComments={setLinkInComments}
                                handleGenerate={handleGenerate}
                            />
                        </div>
                    </div>
                </aside>

                {/* ── Right column: results ── */}
                <main className="flex-1 flex flex-col min-w-0">
                    <ResultsPanel
                        generatedPosts={generatedPosts}
                        loading={generateMutation.isPending}
                        activePlatform={activePlatform}
                        setActivePlatform={setActivePlatform}
                        copyToClipboard={copyToClipboard}
                        handleSave={handleSave}
                        savedPosts={savedPosts}
                        config={config}
                    />
                </main>
            </div>
        </PageTransition>
    );
}
