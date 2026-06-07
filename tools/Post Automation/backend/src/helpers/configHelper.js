const { getDb } = require('../db');

const getEffectiveConfig = async (key) => {
    try {
        const db = await getDb();
        const result = await db.get('SELECT value FROM config WHERE key = ?', key);
        return result ? result.value : null;
    } catch (e) {
        console.warn(`Failed to fetch config for ${key}:`, e);
        return null;
    }
};

module.exports = { getEffectiveConfig };
