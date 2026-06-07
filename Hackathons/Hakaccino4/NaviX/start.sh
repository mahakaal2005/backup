#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting Navix..."

if [ -z "$GROQ_API_KEY" ]; then
  if [ -f "$SCRIPT_DIR/backend/.env" ]; then
    export $(grep -v '^#' "$SCRIPT_DIR/backend/.env" | xargs)
  fi
fi

if [ -z "$GROQ_API_KEY" ] || [ "$GROQ_API_KEY" = "your_groq_api_key_here" ]; then
  echo "ERROR: GROQ_API_KEY is not set." >&2
  echo "Edit backend/.env and set your key, or add it as a Replit secret." >&2
  exit 1
fi

echo "Clearing any stale processes on ports 8000 and 5000..."
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 5000/tcp 2>/dev/null || true

# Also kill lingering next-server and python main.py processes by inode lookup
for INODE in $(cat /proc/net/tcp6 /proc/net/tcp 2>/dev/null | awk '$2 ~ /:(1388|1F40)$/ {print $10}'); do
  for pid_dir in /proc/[0-9]*; do
    PID_NUM=$(basename "$pid_dir")
    if ls -la "/proc/$PID_NUM/fd" 2>/dev/null | grep -q "socket:\[$INODE\]"; then
      kill -9 "$PID_NUM" 2>/dev/null || true
    fi
  done
done
sleep 1

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
cd "$SCRIPT_DIR/frontend" && npm run dev -- --port 5000

wait $BACKEND_PID
