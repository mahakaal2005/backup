# Post Automation

Generate social media posts from YouTube videos using AI.

Paste a YouTube URL, choose your tone and platform, and get ready-to-publish posts for LinkedIn and YouTube Community.

## Features

- **Video Analysis** — Extracts title, description, and tags from YouTube videos
- **AI Post Generation** — Creates platform-specific posts using Google Gemini
- **Multiple Tones** — Professional, casual, or custom styles
- **Post History** — Saves generated posts for later use
- **Templates** — Reuse successful post formats

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Backend  | Node.js, Express                    |
| Database | SQLite                              |
| AI       | Google Gemini API                   |
| Data     | YouTube Data API v3                 |

## Quick Start

### Prerequisites

- Node.js 18+
- YouTube Data API key
- Google Gemini API key

### Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:mahakaal2005/Post-Automation.git
   cd Post-Automation
   ```

2. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   ```
   Add your API keys to `backend/.env`:
   ```
   YOUTUBE_API_KEY=your_youtube_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Install dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

4. **Start the servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && node src/server.js

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

5. Open http://localhost:5173

## Project Structure

```
.
├── backend/
│   └── src/
│       ├── db/              # SQLite database
│       ├── routes/          # API endpoints
│       ├── services/        # YouTube & Gemini integrations
│       └── server.js        # Express server
└── frontend/
    └── src/
        ├── components/      # Reusable UI components
        ├── views/           # Page components
        └── api/             # API client
```

## API Endpoints

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| GET    | `/health`             | Server health check        |
| POST   | `/api/generate`       | Generate posts from URL    |
| GET    | `/api/history`        | Fetch saved posts          |
| GET    | `/api/templates`      | List post templates        |

## License

MIT
