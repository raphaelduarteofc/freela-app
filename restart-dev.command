#!/bin/bash
cd "$(dirname "$0")"
echo "🔄 Parando servidor anterior..."
pkill -f "next dev" 2>/dev/null
sleep 1
echo "🚀 Iniciando dev server..."
npm run dev
