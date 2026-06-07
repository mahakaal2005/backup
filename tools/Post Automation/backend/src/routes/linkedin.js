const express = require('express');
const router = express.Router();
const axios = require('axios');

// Middleware to ensure user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Not authenticated with LinkedIn' });
};

// POST /api/linkedin/share
router.post('/share', isAuthenticated, async (req, res) => {
    try {
        const { text, url, visibility = "PUBLIC" } = req.body;
        const accessToken = req.user.accessToken;
        const authorUrn = `urn:li:person:${req.user.id}`;

        const postBody = {
            author: authorUrn,
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: {
                        text: text
                    },
                    shareMediaCategory: "ARTICLE",
                    media: [
                        {
                            status: "READY",
                            description: {
                                text: "Shared via Post Automation"
                            },
                            originalUrl: url,
                            title: {
                                text: "Watch Video"
                            }
                        }
                    ]
                }
            },
            visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": visibility
            }
        };

        const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', postBody, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json'
            }
        });

        res.json({ success: true, postId: response.data.id });

    } catch (error) {
        console.error('LinkedIn Share Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to post to LinkedIn' });
    }
});

module.exports = router;
