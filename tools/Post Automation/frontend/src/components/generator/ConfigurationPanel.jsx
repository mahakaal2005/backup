import React from 'react';
import { SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../Card';
import Button from '../Button';
import Input from '../Input';
import VideoPreview from './VideoPreview';

export default function ConfigurationPanel({
    url,
    setUrl,
    loading,
    handleFetchVideo,
    videoData,
    tone,
    setTone,
    handleGenerate,
    generatedPosts,
    model,
    setModel,
    linkedinCount,
    setLinkedinCount,
    youtubeCount,
    setYoutubeCount
}) {
    const handleModelChange = (e) => {
        const newModel = e.target.value;
        setModel(newModel);
        // Persist change
        import('../../api/client').then(({ api }) => {
            api.saveConfig('gemini_model', newModel).catch(console.error);
        });
    };
    return (
        <div className={`col-span-4 flex flex-col gap-8 ${!generatedPosts ? 'justify-center' : ''}`}>
            {generatedPosts && (
                <div className="invisible flex p-1.5 border border-transparent">
                    <button className="px-8 py-3 font-medium">LinkedIn</button>
                </div>
            )}
            <Card className="flex flex-col gap-8 p-8" glass>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-accent-primary/10 rounded-xl">
                        <SparklesIcon className="w-6 h-6 text-accent-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Configuration</h2>
                </div>

                <div className="flex gap-3 items-end">
                    <Input
                        label="YouTube URL"
                        placeholder="https://youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1"
                        disabled={loading}
                    />
                    <Button onClick={handleFetchVideo} disabled={loading} className="mb-[2px] px-4 h-[50px]">
                        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                <VideoPreview videoData={videoData} />

                <div className="space-y-4 mt-2 mb-8">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-text-secondary font-medium block ml-1">Tone</label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['Professional', 'Casual', 'Engaging', 'Technical'].map(t => (
                            <motion.button
                                key={t}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setTone(t)}
                                className={`
                      p-4 rounded-xl border text-sm font-medium transition-all duration-200
                      ${tone === t
                                        ? 'bg-accent-primary/15 border-accent-primary text-accent-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                                        : 'bg-bg-secondary border-white/5 text-text-secondary hover:border-white/20 hover:text-white'
                                    }
                    `}
                            >
                                {t}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <label className="text-sm text-text-secondary font-medium block ml-1">AI Model</label>
                    <select
                        value={model}
                        onChange={handleModelChange}
                        className="w-full bg-bg-secondary border border-white/5 rounded-xl p-4 text-sm focus:border-accent-primary/50 outline-none transition-colors duration-200"
                    >
                        {/* PROVEN MODELS */}
                        <option value="llama-3.3-70b-versatile">Llama 3.3 70B (🏆 Best Overall)</option>

                        {/* SPECIALIZED MODELS */}
                        <option value="moonshotai/kimi-k2-instruct-0905">Kimi K2 Instruct (262k Context) 🌏</option>
                        <option value="openai/gpt-oss-120b">GPT-OSS 120B (OpenAI Open Source) 🤖</option>
                        <option value="qwen/qwen3-32b">Qwen 3 32B (Balanced)</option>

                        {/* FALLBACK */}
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    </select>
                </div>

                <div className="space-y-4 mb-8">
                    <label className="text-sm text-text-secondary font-medium block ml-1">Posts to Generate</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-text-secondary block ml-1 mb-2">LinkedIn Posts</label>
                            <select
                                value={linkedinCount}
                                onChange={(e) => setLinkedinCount(Number(e.target.value))}
                                className="w-full bg-bg-secondary border border-white/5 rounded-xl p-3 text-sm focus:border-accent-primary/50 outline-none transition-colors duration-200"
                            >
                                <option value="1">1 Post</option>
                                <option value="2">2 Posts</option>
                                <option value="3">3 Posts</option>
                                <option value="4">4 Posts</option>
                                <option value="5">5 Posts</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary block ml-1 mb-2">YouTube Posts</label>
                            <select
                                value={youtubeCount}
                                onChange={(e) => setYoutubeCount(Number(e.target.value))}
                                className="w-full bg-bg-secondary border border-white/5 rounded-xl p-3 text-sm focus:border-accent-primary/50 outline-none transition-colors duration-200"
                            >
                                <option value="1">1 Post</option>
                                <option value="2">2 Posts</option>
                                <option value="3">3 Posts</option>
                                <option value="4">4 Posts</option>
                                <option value="5">5 Posts</option>
                            </select>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={!videoData || loading}
                    className="w-full py-4 text-lg"
                    variant={!videoData ? 'secondary' : 'gradient'}
                    icon={SparklesIcon}
                >
                    {loading ? 'Generating Magic...' : 'Generate Posts'}
                </Button>
            </Card>
        </div>
    );
}
