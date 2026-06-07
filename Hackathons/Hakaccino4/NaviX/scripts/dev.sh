#!/usr/bin/env bash
# ============================================================
# dev.sh — NaviX local development server
# Usage: bash scripts/dev.sh
# ============================================================

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# ── Load nvm node into PATH ────────────────────────────────
export PATH="$HOME/.nvm/versions/node/v24.12.0/bin:$PATH"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║      NaviX — Dev Server Launcher     ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── Kill anything on ports 8000 and 3000 ──────────────────
echo "🔪 Freeing ports 8000 and 3000..."

for PORT in 8000 3000; do
  PID=$(lsof -ti tcp:$PORT 2>/dev/null || true)
  if [ -n "$PID" ]; then
    kill -9 $PID 2>/dev/null && echo "  ✅ Killed process on port $PORT (PID $PID)"
  else
    echo "  ✔  Port $PORT already free"
  fi
done

sleep 1

# ── Load .env ──────────────────────────────────────────────
if [ -f "$ROOT/backend/.env" ]; then
  set -a; source "$ROOT/backend/.env"; set +a
  echo "✅ Loaded backend/.env"
else
  echo "❌ backend/.env not found! Copy backend/.env.example and fill in your keys."
  exit 1
fi

# ── Start Backend ──────────────────────────────────────────
echo ""
echo "🐍 Starting backend (FastAPI on :8000)..."
"$ROOT/.venv/bin/python" "$ROOT/backend/main.py" > /tmp/navix_backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to be ready
for i in $(seq 1 20); do
  sleep 1
  if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend ready → http://localhost:8000"
    break
  fi
  if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend crashed! Logs:"
    cat /tmp/navix_backend.log
    exit 1
  fi
  echo "   waiting... ($i/20)"
done

# ── Start Frontend ─────────────────────────────────────────
echo ""
echo "⚡ Starting frontend (Next.js on :3000)..."
cd "$ROOT/frontend"
./node_modules/.bin/next dev > /tmp/navix_frontend.log 2>&1 &
FRONTEND_PID=$!

for i in $(seq 1 20); do
  sleep 1
  if grep -q "localhost:3000" /tmp/navix_frontend.log 2>/dev/null; then
    echo "✅ Frontend ready → http://localhost:3000"
    break
  fi
  if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Frontend crashed! Logs:"
    cat /tmp/navix_frontend.log | tail -20
    exit 1
  fi
  echo "   waiting... ($i/20)"
done

# ── Done ───────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════╗"
echo "║  🚀 NaviX is running!                ║"
echo "║  Frontend  →  http://localhost:3000  ║"
echo "║  Backend   →  http://localhost:8000  ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Logs:  tail -f /tmp/navix_backend.log"
echo "       tail -f /tmp/navix_frontend.log"
echo ""
echo "Stop:  kill $BACKEND_PID $FRONTEND_PID"
echo "  or:  bash scripts/stop.sh"

# Keep script alive so Ctrl+C kills both
wait $BACKEND_PID $FRONTEND_PID
