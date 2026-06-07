import os
import sys
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = "llama-3.1-8b-instant"

DATABASE_PATH = os.path.join(os.path.dirname(__file__), "navix.db")
REPORTS_DIR = os.path.join(os.path.dirname(__file__), "reports")

os.makedirs(REPORTS_DIR, exist_ok=True)

if not GROQ_API_KEY or GROQ_API_KEY in ("your_groq_api_key_here", "gsk_your_groq_api_key_here"):
    print(
        "ERROR: GROQ_API_KEY is not set.\n"
        "Edit backend/.env and set your key, or add it as a Replit secret.\n"
        "Get a free key at https://console.groq.com/",
        file=sys.stderr,
    )
    sys.exit(1)
