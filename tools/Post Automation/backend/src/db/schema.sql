-- Prompt Templates
CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    tone TEXT,
    platform TEXT CHECK(platform IN ('linkedin', 'youtube', 'both')),
    is_favorite BOOLEAN DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post History
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_url TEXT NOT NULL,
    video_title TEXT,
    video_description TEXT,
    video_thumbnail TEXT,
    platform TEXT NOT NULL CHECK(platform IN ('linkedin', 'youtube')),
    generated_post TEXT NOT NULL,
    template_id INTEGER,
    variation_index INTEGER,
    tone TEXT,
    length TEXT,
    custom_hashtags TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES prompts(id) ON DELETE SET NULL
);

-- Indices for History
CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_history_platform ON history(platform);

-- User Configuration
CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning Data (for style adaptation)
CREATE TABLE IF NOT EXISTS learning_patterns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern_type TEXT CHECK(pattern_type IN (
        'word_preference',
        'tone_preference',
        'length_preference',
        'hook_style',
        'emoji_usage',
        'hashtag_count'
    )),
    pattern_data TEXT NOT NULL, -- JSON string
    confidence_score REAL DEFAULT 0.5,
    sample_size INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
