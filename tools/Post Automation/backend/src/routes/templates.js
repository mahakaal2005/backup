const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// GET /api/templates
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const templates = await db.all('SELECT * FROM prompts ORDER BY created_at DESC');
        res.json(templates);
    } catch (error) {
        console.error('Templates fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

// POST /api/templates
router.post('/', async (req, res) => {
    try {
        const db = await getDb();
        const { name, prompt_text, tone, platform } = req.body;

        if (!name || !prompt_text) {
            return res.status(400).json({ error: 'Name and prompt text are required' });
        }

        const result = await db.run(
            `INSERT INTO prompts (name, prompt_text, tone, platform) 
       VALUES (?, ?, ?, ?)`,
            [name, prompt_text, tone, platform]
        );

        res.json({ id: result.lastID, name, prompt_text, tone, platform });
    } catch (error) {
        console.error('Template create error:', error);
        res.status(500).json({ error: 'Failed to create template' });
    }
});

// DELETE /api/templates/:id
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDb();
        const { id } = req.params;
        await db.run('DELETE FROM prompts WHERE id = ?', id);
        res.json({ message: 'Template deleted' });
    } catch (error) {
        console.error('Template delete error:', error);
        res.status(500).json({ error: 'Failed to delete template' });
    }
});

module.exports = router;
