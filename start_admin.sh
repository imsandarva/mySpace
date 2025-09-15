#!/bin/bash

# Start the admin server for easy post creation
echo "🚀 Starting Sandarva's Admin Server..."
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Flask is installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "📦 Installing Flask..."
    pip3 install flask
fi

# Start the server
echo "🌐 Admin panel will be available at: http://localhost:5000/admin"
echo "🏠 Website will be available at: http://localhost:5000"
echo ""
echo "💡 Press Ctrl+C to stop the server"
echo ""

python3 server.py
