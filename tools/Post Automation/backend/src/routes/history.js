const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// GET /api/history
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const history = await db.all('SELECT * FROM history ORDER BY created_at DESC LIMIT 50');
        res.json(history);
    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// POST /api/history
router.post('/', async (req, res) => {
    try {
        const db = await getDb();
        const { video_url, video_title, platform, generated_post, tone } = req.body;

        const result = await db.run(
            `INSERT INTO history (video_url, video_title, platform, generated_post, tone) 
       VALUES (?, ?, ?, ?, ?)`,
            [video_url, video_title, platform, generated_post, tone]
        );

        res.json({ id: result.lastID, status: 'saved' });
    } catch (error) {
        console.error('History save error:', error);
        res.status(500).json({ error: 'Failed to save history' });
    }
});

// DELETE /api/history/:id
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDb();
        const { id } = req.params;
        await db.run('DELETE FROM history WHERE id = ?', [id]);
        res.json({ status: 'deleted' });
    } catch (error) {
        console.error('History delete error:', error);
        res.status(500).json({ error: 'Failed to delete history item' });
    }
});

module.exports = router;
