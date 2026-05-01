#!/bin/bash

source ./sandbox/scripts/.venv/bin/activate
pip install -r ./sandbox/scripts/requirements.txt
python3 ./sandbox/scripts/pipeline.py

set -e

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
