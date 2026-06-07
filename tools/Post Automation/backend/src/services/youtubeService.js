const { google } = require('googleapis');
require('dotenv').config();

// function to initialize youtube client with dynamic key
const getYoutubeClient = (apiKey) => {
    return google.youtube({
        version: 'v3',
        auth: apiKey || process.env.YOUTUBE_API_KEY
    });
};

// Mock data for fallback or testing
const getMockVideoData = (url) => ({
    title: "Mock: How to Build an AI App",
    description: "In this video, we learn how to build an AI application using React and Node.js. #coding #ai #javascript",
    tags: ["coding", "ai", "react", "nodejs"],
    publishedAt: new Date().toISOString(),
    thumbnail: "https://via.placeholder.com/640x360.png?text=Video+Thumbnail",
    channelTitle: "Dev Channel"
});

async function fetchVideoMetadata(videoUrl, apiKey) {
    try {
        // 1. Extract Video ID
        let videoId = null;
        try {
            const urlObj = new URL(videoUrl);
            if (urlObj.hostname.includes('youtube.com')) {
                videoId = urlObj.searchParams.get('v');
            } else if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            }
        } catch (e) {
            console.warn('Invalid URL format, using mock data if API fails');
        }

        const currentApiKey = apiKey || process.env.YOUTUBE_API_KEY;

        // 2. Check API Key presence
        if (!currentApiKey || currentApiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
            console.warn('YouTube API Key missing or default. Returning mock data.');
            return getMockVideoData(videoUrl);
        }

        if (!videoId) {
            throw new Error("Could not extract video ID");
        }

        const youtube = getYoutubeClient(currentApiKey);

        // 3. Call API
        const response = await youtube.videos.list({
            part: ['snippet'],
            id: [videoId]
        });

        if (response.data.items.length === 0) {
            throw new Error('Video not found');
        }

        const snippet = response.data.items[0].snippet;

        return {
            title: snippet.title,
            description: snippet.description,
            tags: snippet.tags || [],
            publishedAt: snippet.publishedAt,
            thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
            channelTitle: snippet.channelTitle
        };

    } catch (error) {
        console.error('YouTube API Error:', error.message);
        // Fallback to mock data for end-to-end testing seamlessness
        return getMockVideoData(videoUrl);
    }
}

module.exports = { fetchVideoMetadata };
