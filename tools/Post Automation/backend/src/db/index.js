const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../data/posts.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

let dbInstance = null;

async function getDb() {
    if (dbInstance) return dbInstance;

    try {
        dbInstance = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log(`Connected to SQLite database at ${dbPath}`);
        await initSchema(dbInstance);

        return dbInstance;
    } catch (error) {
        console.error('Failed to connect to database:', error);
        throw error;
    }
}

async function initSchema(db) {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon to execute statement by statement if needed, 
        // but sqlite.exec can usually handle multiple statements.
        await db.exec(schema);
        console.log('Database schema initialized');
    } catch (error) {
        console.error('Failed to initialize schema:', error);
    }
}

module.exports = { getDb };
