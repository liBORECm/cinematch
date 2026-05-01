#!/bin/bash

set -e

echo "🐍 Creating venv..."
python3 -m venv venv

echo "📦 Installing Python deps..."
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r ./sandbox/scripts/requirements.txt

echo "🚀 Running ML pipeline..."
./venv/bin/python ./sandbox/scripts/pipeline.py
