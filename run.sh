#!/bin/bash

echo "========================================"
echo "  Skin Saviour - Starting Application"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "[1/3] Checking Python installation..."
python3 --version
echo ""

echo "[2/3] Installing/Updating dependencies..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo ""

echo "[3/3] Starting Skin Saviour application..."
echo ""
echo "========================================"
echo "  Application will start at:"
echo "  http://localhost:5000"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 app.py

