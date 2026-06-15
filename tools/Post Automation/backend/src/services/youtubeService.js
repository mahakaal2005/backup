const { google } = require('googleapis');
require('dotenv').config();

// function to initialize youtube client with dynamic key
const getYoutubeClient = (apiKey) => {
    return google.youtube({
        version: 'v3',
        auth: apiKey || process.env.YOUTUBE_API_KEY
    });
};

// Mock data for fallback or testing (clearly labeled, only used when explicitly needed)
const getMockVideoData = (url) => ({
    title: "[MOCK] Sample Video",
    description: "[MOCK DATA — YouTube API key missing or invalid. Real video data was not fetched.]",
    tags: ["mock"],
    publishedAt: new Date().toISOString(),
    thumbnail: "https://via.placeholder.com/640x360.png?text=Mock+Video",
    channelTitle: "Mock Channel",
    isMock: true
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
        if (!currentApiKey || currentApiKey.toLowerCase().startsWith('your_')) {
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
        // Re-throw the error so the caller knows the fetch failed.
        // Do NOT silently return mock data — the AI will generate posts about fake content.
        throw new Error(`Failed to fetch YouTube video metadata: ${error.message}`);
    }
}

module.exports = { fetchVideoMetadata };
