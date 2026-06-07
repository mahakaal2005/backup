const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// GET /api/config
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const config = await db.all('SELECT * FROM config');
        // Convert array to object for easier frontend consumption
        const configObj = config.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        // Merge with process.env (Env vars take precedence if DB is empty, or can just fill gaps)
        // Mapping: Config Key -> Env Var
        const envMapping = {
            'youtube_api_key': 'YOUTUBE_API_KEY',
            'gemini_api_key': 'GEMINI_API_KEY',
            'groq_api_key': 'GROQ_API_KEY',
            'youtube_community_url': 'YOUTUBE_COMMUNITY_URL',
            'gemini_model': 'GEMINI_MODEL'
        };

        Object.entries(envMapping).forEach(([configKey, envKey]) => {
            if (process.env[envKey] && !configObj[configKey]) {
                configObj[configKey] = process.env[envKey];
            }
        });

        res.json(configObj);
    } catch (error) {
        console.error('Config fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch config' });
    }
});

const fs = require('fs');
const path = require('path');

// Helper to update .env
function updateEnvFile(key, value) {
    const envPath = path.resolve(__dirname, '../../.env');
    let envContent = '';

    // Read existing
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Convert key to ENV_FORMAT (e.g. linkedin_client_id -> LINKEDIN_CLIENT_ID)
    const envKey = key.toUpperCase();

    // Check if key exists
    const regex = new RegExp(`^${envKey}=.*`, 'm');
    if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${envKey}=${value}`);
    } else {
        envContent += `\n${envKey}=${value}`;
    }

    fs.writeFileSync(envPath, envContent);
}

// POST /api/config
router.post('/', async (req, res) => {
    try {
        const db = await getDb();
        const { key, value } = req.body;

        if (!key) {
            return res.status(400).json({ error: 'Config key is required' });
        }

        // Upsert logic in DB
        await db.run(`INSERT INTO config (key, value) VALUES (?, ?) 
            ON CONFLICT(key) DO UPDATE SET value=excluded.value`, [key, value]);

        // Also update .env for specific keys that Passport/System needs
        const systemKeys = ['linkedin_client_id', 'linkedin_client_secret', 'youtube_api_key', 'gemini_api_key', 'groq_api_key', 'youtube_handle', 'youtube_community_url'];
        if (systemKeys.includes(key)) {
            updateEnvFile(key, value);
        }

        res.json({ message: 'Config saved', key, value });
    } catch (error) {
        console.error('Config save error:', error);
        res.status(500).json({ error: 'Failed to save config' });
    }
});

module.exports = router;
