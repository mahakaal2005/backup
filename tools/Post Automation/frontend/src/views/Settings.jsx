import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Cog6ToothIcon, KeyIcon, CheckCircleIcon, LinkIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import PageTransition from '../components/PageTransition';
import { api } from '../api/client';

export default function Settings() {
    const queryClient = useQueryClient();
    const [config, setConfig] = useState({
        youtube_api_key: '',
        youtube_community_url: '', // Changed from handle to full URL
        gemini_api_key: '',
        groq_api_key: '',
        gemini_model: 'gemini-2.5-flash'
    });

    // Fetch Config
    const { data: serverConfig, isLoading: loading, error } = useQuery({
        queryKey: ['config'],
        queryFn: () => api.getConfig(),
    });

    // Sync server config to local state when loaded
    useEffect(() => {
        if (serverConfig) {
            setConfig({
                youtube_api_key: serverConfig.youtube_api_key || '',
                youtube_community_url: serverConfig.youtube_community_url || '', // Sync URL
                gemini_api_key: serverConfig.gemini_api_key || '',
                groq_api_key: serverConfig.groq_api_key || '',
                gemini_model: serverConfig.gemini_model || 'gemini-2.5-flash'
            });
        }
    }, [serverConfig]);

    // Save Mutation
    const saveMutation = useMutation({
        mutationFn: async (newConfig) => {
            // Sequential save
            await api.saveConfig('youtube_api_key', newConfig.youtube_api_key);
            await api.saveConfig('youtube_community_url', newConfig.youtube_community_url); // Save URL
            await api.saveConfig('gemini_api_key', newConfig.gemini_api_key);
            await api.saveConfig('groq_api_key', newConfig.groq_api_key);
            await api.saveConfig('gemini_model', newConfig.gemini_model);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['config'] });
            toast.success('Settings saved successfully');
        },
        onError: (err) => {
            toast.error('Failed to save settings');
            console.error(err);
        }
    });

    const handleSave = (e) => {
        e.preventDefault();
        saveMutation.mutate(config);
    };

    if (error) {
        toast.error('Failed to load settings');
    }

    return (
        <PageTransition>
            <div className="space-y-8 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent flex items-center gap-3">
                        <Cog6ToothIcon className="w-8 h-8 text-accent-primary" />
                        Settings
                    </h1>
                    <p className="text-text-secondary mt-1">Manage API keys and application preferences</p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        <div className="h-40 bg-white/5 rounded-2xl animate-pulse"></div>
                    </div>
                ) : (
                    <>
                        <Card glass className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 bg-accent-primary/10 rounded-xl">
                                    <KeyIcon className="w-6 h-6 text-accent-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">API Configuration</h2>
                                    <p className="text-text-secondary text-sm">
                                        Configure your API keys for YouTube, Gemini, and Groq services.
                                        These keys are stored locally in your database.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <Input
                                    label="YouTube Data API Key"
                                    placeholder="Enter your YouTube API Key"
                                    value={config.youtube_api_key}
                                    onChange={(e) => setConfig({ ...config, youtube_api_key: e.target.value })}
                                    type="password"
                                    icon={KeyIcon}
                                    className="bg-black/20 focus:bg-black/40 border-white/5 focus:border-accent-primary/50"
                                />

                                <Input
                                    label="YouTube Community URL (Optional)"
                                    placeholder="e.g. https://www.youtube.com/@handle/community"
                                    value={config.youtube_community_url || ''}
                                    onChange={(e) => setConfig({ ...config, youtube_community_url: e.target.value })}
                                    type="text"
                                    icon={LinkIcon}
                                    className="bg-black/20 focus:bg-black/40 border-white/5 focus:border-accent-primary/50"
                                />

                                <Input
                                    label="Gemini API Key"
                                    placeholder="Enter your Google Gemini API Key"
                                    value={config.gemini_api_key}
                                    onChange={(e) => setConfig({ ...config, gemini_api_key: e.target.value })}
                                    type="password"
                                    icon={KeyIcon}
                                    className="bg-black/20 focus:bg-black/40 border-white/5 focus:border-accent-primary/50"
                                />

                                <Input
                                    label="Groq API Key"
                                    placeholder="Enter your Groq API Key"
                                    value={config.groq_api_key}
                                    onChange={(e) => setConfig({ ...config, groq_api_key: e.target.value })}
                                    type="password"
                                    icon={KeyIcon}
                                    className="bg-black/20 focus:bg-black/40 border-white/5 focus:border-accent-primary/50"
                                />

                                <div className="border-t border-white/10 my-6 pt-6"></div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary ml-1">AI Model Preference</label>
                                    <div className="relative">
                                        <select
                                            value={config.gemini_model}
                                            onChange={(e) => setConfig({ ...config, gemini_model: e.target.value })}
                                            className="w-full bg-bg-secondary border border-white/10 rounded-xl p-4 pl-4 text-white focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all appearance-none"
                                        >
                                            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                                            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                            <option value="gemini-flash-lite-latest">Gemini Flash Lite (Fastest)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-secondary ml-1">Select the Gemini model used for content generation.</p>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button
                                        type="submit"
                                        loading={saveMutation.isPending}
                                        icon={CheckCircleIcon}
                                    >
                                        {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>

                                <div className="bg-white/5 rounded-lg p-4 text-sm text-text-secondary">
                                    <p className="font-medium text-white mb-2">Note:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Keys are required for fetching video data and generating posts.</li>
                                        <li>If keys are not provided here, the system will fall back to environment variables or mock data.</li>
                                    </ul>
                                </div>
                            </form>
                        </Card>
                    </>
                )}
            </div>
        </PageTransition>
    );
}
