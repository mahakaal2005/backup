#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting Navix (production)..."

if [ -z "$GROQ_API_KEY" ]; then
  if [ -f "$SCRIPT_DIR/backend/.env" ]; then
    export $(grep -v '^#' "$SCRIPT_DIR/backend/.env" | xargs)
  fi
fi

if [ -z "$GROQ_API_KEY" ] || [ "$GROQ_API_KEY" = "your_groq_api_key_here" ] || [ "$GROQ_API_KEY" = "gsk_your_groq_api_key_here" ]; then
  echo "ERROR: GROQ_API_KEY is not set." >&2
  exit 1
fi

echo "Starting backend (port 8000)..."
cd "$SCRIPT_DIR/backend" && python main.py &
BACKEND_PID=$!

echo "Waiting for backend to be ready..."
BACKEND_READY=0
for i in $(seq 1 30); do
  if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "Backend is ready."
    BACKEND_READY=1
    break
  fi
  sleep 1
done

if [ "$BACKEND_READY" -eq 0 ]; then
  echo "ERROR: Backend did not start within 30 seconds." >&2
  kill $BACKEND_PID 2>/dev/null
  exit 1
fi

echo "Starting frontend (port 5000)..."
cd "$SCRIPT_DIR/frontend" && npm start -- --port 5000

wait $BACKEND_PID
