const express = require('express');
const router = express.Router();
const { fetchVideoMetadata } = require('../services/youtubeService');
const { getEffectiveConfig } = require('../helpers/configHelper');

// POST /api/video/fetch
router.post('/fetch', async (req, res) => {
    try {
        const { videoUrl } = req.body;
        if (!videoUrl) {
            return res.status(400).json({ error: 'Video URL is required' });
        }

        const apiKey = await getEffectiveConfig('youtube_api_key');
        const metadata = await fetchVideoMetadata(videoUrl, apiKey);
        res.json(metadata);
    } catch (error) {
        console.error('Video fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch video metadata' });
    }
});

module.exports = router;
