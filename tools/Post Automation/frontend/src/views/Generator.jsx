import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PageTransition from '../components/PageTransition';
import { api } from '../api/client';
import ConfigurationPanel from '../components/generator/ConfigurationPanel';
import ResultsPanel from '../components/generator/ResultsPanel';

export default function Generator() {
    const location = useLocation();
    const queryClient = useQueryClient();
    const [url, setUrl] = useState('');
    const [activePlatform, setActivePlatform] = useState('linkedin');
    const [tone, setTone] = useState('Professional');
    const [model, setModel] = useState('groq');
    const [linkedinCount, setLinkedinCount] = useState(1);
    const [youtubeCount, setYoutubeCount] = useState(1);

    // Cache: Video Data
    const { data: videoData } = useQuery({
        queryKey: ['currentVideoData'],
        staleTime: Infinity,
        gcTime: 1000 * 60 * 30, // 30 mins
        initialData: null
    });

    // Cache: Generated Posts
    const { data: generatedPosts } = useQuery({
        queryKey: ['currentGeneratedPosts'],
        staleTime: Infinity,
        gcTime: 1000 * 60 * 30,
        initialData: null
    });

    // Cache: Saved Posts (IDs)
    const { data: savedPostsArr = [] } = useQuery({
        queryKey: ['currentSavedPosts'],
        staleTime: Infinity,
        gcTime: 1000 * 60 * 30,
        initialData: []
    });

    // Fetch Config for Model Preference
    useQuery({
        queryKey: ['config'],
        queryFn: () => api.getConfig(),
        onSuccess: (config) => {
            if (config.gemini_model) {
                setModel(config.gemini_model);
            }
        }
    });

    // Convert cached array to Set for easy lookup
    const savedPosts = React.useMemo(() => new Set(savedPostsArr), [savedPostsArr]);

    // Video Fetch Mutation
    const videoMutation = useMutation({
        mutationFn: (videoUrl) => api.fetchVideo(videoUrl),
        onSuccess: (data, variables) => {
            // Attach URL to data for restoration
            queryClient.setQueryData(['currentVideoData'], { ...data, videoUrl: variables });
            toast.success('Video found!');
        },
        onError: (err) => {
            toast.error('Could not find video');
            console.error(err);
        }
    });

    // Generate Posts Mutation
    const generateMutation = useMutation({
        mutationFn: (params) => api.generatePosts(params),
        onSuccess: (posts) => {
            queryClient.setQueryData(['currentGeneratedPosts'], posts);
            // Reset saved posts on new generation
            queryClient.setQueryData(['currentSavedPosts'], []);
            toast.success('Posts generated successfully!');
        },
        onError: (err) => {
            toast.error('Generation failed');
            console.error(err);
        }
    });

    // Save History Mutation
    const saveMutation = useMutation({
        mutationFn: (params) => api.saveHistory(params),
        onSuccess: (_, variables) => {
            toast.success('Saved to history!');
            const key = `${variables.platform}-${variables.index}`;
            queryClient.setQueryData(['currentSavedPosts'], (old = []) => [...(old || []), key]);
        },
        onError: (err) => {
            toast.error('Failed to save');
            console.error(err);
        }
    });

    // Handle URL from Dashboard navigation state or Cache
    useEffect(() => {
        if (location.state?.url) {
            setUrl(location.state.url);
            videoMutation.mutate(location.state.url);
        } else if (videoData?.videoUrl) {
            // Restore URL from cache if available
            setUrl(videoData.videoUrl);
        }
    }, [location.state, videoData?.videoUrl]);

    const handleFetchVideo = () => {
        if (!url) {
            toast.error('Please enter a YouTube URL');
            return;
        }
        videoMutation.mutate(url);
    };

    const handleGenerate = () => {
        if (!videoData) return;
        generateMutation.mutate({
            videoData: { ...videoData, url },
            tone,
            length: 'Medium',
            hashtags: videoData.tags,
            model, // Pass selected model
            linkedinCount, // Pass LinkedIn post count
            youtubeCount // Pass YouTube post count
        });
    };

    const handleSave = (postContent, platform, index) => {
        const key = `${platform}-${index}`;
        if (savedPosts.has(key)) {
            // Unsave logic (Client-side toggle for now, as API might not support delete by content/index easily without ID)
            queryClient.setQueryData(['currentSavedPosts'], (old = []) => old.filter(k => k !== key));
            toast.success('Removed from bookmarks');
        } else {
            // Save logic
            saveMutation.mutate({
                video_url: url,
                video_title: videoData?.title || 'Untitled',
                platform: platform,
                generated_post: postContent,
                tone: tone,
                index
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
            <div className="grid grid-cols-12 gap-10 h-[calc(100vh-8rem)]">
                <ConfigurationPanel
                    url={url}
                    setUrl={setUrl}
                    loading={videoMutation.isPending || generateMutation.isPending}
                    handleFetchVideo={handleFetchVideo}
                    videoData={videoData}
                    tone={tone}
                    setTone={setTone}
                    handleGenerate={handleGenerate}
                    generatedPosts={generatedPosts}
                    model={model}
                    setModel={setModel}
                    linkedinCount={linkedinCount}
                    setLinkedinCount={setLinkedinCount}
                    youtubeCount={youtubeCount}
                    setYoutubeCount={setYoutubeCount}
                />

                <ResultsPanel
                    generatedPosts={generatedPosts}
                    loading={generateMutation.isPending}
                    activePlatform={activePlatform}
                    setActivePlatform={setActivePlatform}
                    copyToClipboard={copyToClipboard}
                    handleSave={handleSave}
                    savedPosts={savedPosts}
                />
            </div>
        </PageTransition>
    );
}
