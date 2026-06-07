const express = require('express');
const router = express.Router();
const { generatePosts } = require('../services/geminiService');
const { generatePostsWithGroq } = require('../services/groqService');
const { getDb } = require('../db');
const { getEffectiveConfig } = require('../helpers/configHelper');

// POST /api/generate
router.post('/', async (req, res) => {
    try {
        const { videoData, tone, length, template, customPrompt, hashtags, linkedinCount = 1, youtubeCount = 1 } = req.body;

        // Basic validation
        if (!videoData) {
            return res.status(400).json({ error: 'Video data is required' });
        }

        const model = req.body.model || await getEffectiveConfig('gemini_model') || 'groq';

        console.log('=== GENERATE ROUTE DEBUG ===');
        console.log('Model selected:', model);
        console.log('LinkedIn posts:', linkedinCount);
        console.log('YouTube posts:', youtubeCount);
        console.log('===========================');

        let posts;

        // Use Groq for ALL models except Gemini
        // If it starts with 'gemini', use Google. Otherwise, use Groq.
        if (!model.startsWith('gemini')) {
            console.log(`🚀 Using Groq API for model: ${model}`);

            // Fetch recent history for few-shot learning
            const db = await getDb();
            const historyExamples = await db.all(
                'SELECT platform, generated_post FROM history WHERE tone = ? ORDER BY created_at DESC LIMIT 3',
                [tone]
            );

            posts = await generatePostsWithGroq(videoData, tone, length, hashtags, historyExamples, linkedinCount, youtubeCount, model);
        } else {
            // Use Gemini for gemini models
            console.log('🚀 Using Gemini API');
            const apiKey = await getEffectiveConfig('gemini_api_key') || process.env.GEMINI_API_KEY;

            // Fetch recent history for few-shot learning
            const db = await getDb();
            const historyExamples = await db.all(
                'SELECT platform, generated_post FROM history WHERE tone = ? ORDER BY created_at DESC LIMIT 3',
                [tone]
            );

            posts = await generatePosts(
                videoData,
                tone,
                length,
                hashtags,
                historyExamples,
                apiKey,
                model,
                linkedinCount,
                youtubeCount
            );
        }

        res.json(posts);
    } catch (error) {
        console.error('Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate posts' });
    }
});

module.exports = router;
