#!/bin/bash

# Function to clean up background processes on exit
cleanup() {
    echo ""
    echo "Stopping all services..."
    # Kill all background jobs started by this script
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap Ctrl+C (SIGINT) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "🚀 Starting Post Automation..."

# Start backend in the background
echo "📦 Starting Backend on port 3000..."
cd backend || exit
npm start &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 2

# Start frontend in the foreground
echo "🎨 Starting Frontend on port 5173..."
cd ../frontend || exit
npm run dev

# If frontend exits, cleanup will be called by the trap or below
cleanup
