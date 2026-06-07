#!/usr/bin/env bash
# ============================================================
# stop.sh — Kill NaviX dev servers
# Usage: bash scripts/stop.sh
# ============================================================

echo "🛑 Stopping NaviX..."

for PORT in 8000 3000; do
  PID=$(lsof -ti tcp:$PORT 2>/dev/null || true)
  if [ -n "$PID" ]; then
    kill -9 $PID 2>/dev/null && echo "  ✅ Stopped port $PORT (PID $PID)"
  else
    echo "  ✔  Port $PORT was already free"
  fi
done

echo "Done."
