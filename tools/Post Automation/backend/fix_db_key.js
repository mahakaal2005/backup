const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
require('dotenv').config();

(async () => {
    const db = await open({ filename: './data/posts.db', driver: sqlite3.Database });
    const newKey = process.env.GROQ_API_KEY;
    if (!newKey) { console.error('GROQ_API_KEY not found in .env'); process.exit(1); }
    await db.run('UPDATE config SET value = ? WHERE key = ?', [newKey, 'groq_api_key']);
    const row = await db.get('SELECT * FROM config WHERE key = ?', 'groq_api_key');
    console.log('groq_api_key in DB is now:', row.value.substring(0, 20) + '...');
    console.log('Done — restart the backend server.');
    await db.close();
})();
