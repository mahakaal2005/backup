# NaviX 🧭

> AI-powered project risk navigation — built at Hakaccino4 Hackathon

NaviX is an intelligent multi-agent risk analysis assistant that helps project managers navigate supply chain, political, tariff, and logistics risks in real time — powered by Azure AI Foundry.

---

## ✨ Features

- 📁 **Excel Schedule Upload** — import project timelines instantly
- 🤖 **Multi-Agent AI Analysis** — specialized agents for political, tariff, logistics, and scheduling risks
- 🗺️ **Interactive Risk Heatmap** — country-level risk visualization on a live map
- 💬 **Conversational Chat Interface** — ask questions, get structured risk reports
- 📄 **Auto-generated Reports** — downloadable `.docx` risk reports per session
- 🧠 **Thinking Logs** — transparent agent reasoning visible to the user
- 🌙 **Dark Mode** — sleek, hackathon-ready UI

---

## 🏗️ Project Structure

```
NaviX/
├── backend/
│   ├── agents/
│   │   ├── orchestrator.py        # Routes queries to specialist agents
│   │   ├── political_risk_agent.py
│   │   ├── tariff_risk_agent.py
│   │   ├── logistics_risk_agent.py
│   │   ├── scheduler_agent.py
│   │   ├── reporting_agent.py
│   │   └── assistant_agent.py
│   ├── config.py                  # Azure & app configuration
│   ├── database.py                # SQLite session persistence
│   ├── models.py                  # Data models
│   ├── main.py                    # FastAPI entry point
│   ├── requirements.txt
│   └── .env.example               # Environment variable template
├── frontend/
│   └── ...                        # React + Vite frontend
├── docs/
│   └── images/                    # Architecture diagrams & screenshots
├── scripts/                       # Utility scripts
├── main.py                        # App launcher
├── start.sh                       # Dev startup script
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+

### Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your Azure credentials in .env
pip install -r requirements.txt
python main.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Or just run everything:

```bash
bash start.sh
```

---

## ⚙️ Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```
AZURE_AI_PROJECT_CONNECTION_STRING=...
AZURE_OPENAI_DEPLOYMENT_NAME=...
BING_SEARCH_API_KEY=...
```

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Leaflet.js |
| Backend | FastAPI, Python 3.11 |
| AI | Azure AI Foundry, GPT-4o |
| Search | Bing Search API |
| Database | SQLite |
| Reports | python-docx |

---

## 👥 Team

| Name | GitHub | Role |
|------|--------|------|
| Mahakaal | [@mahakaal2005](https://github.com/mahakaal2005) | Backend & AI Agents |
| Faiqua Naeem | [@FaiquaNaeem](https://github.com/FaiquaNaeem) | Database & DevOps |
| Rudy | [@RudyMontoo](https://github.com/RudyMontoo) | API & AI Agents Integration |
| Ayush Chourasia | [@Ayushchourasia03](https://github.com/Ayushchourasia03) | Frontend & UI-UX |

---

## 🏆 Hackathon

Built at **Hakaccino4** · April 11–12, 2026 · 24-hour sprint
