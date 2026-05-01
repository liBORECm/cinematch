#!/bin/bash

set -e

echo "🐍 Creating venv..."
python3 -m venv venv

echo "📦 Installing Python deps..."
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r ./sandbox/scripts/requirements.txt

echo "🚀 Running ML pipeline..."
./venv/bin/python ./sandbox/scripts/pipeline.py

echo "🚀 Building frontend..."
cd frontend
npm install
npm run build

echo "📦 Deploying frontend to nginx..."
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

cd ..

echo "🐳 Starting backend + ml-api..."
docker compose up -d --build

echo "✅ DONE"
