#!/bin/bash
cd "$(dirname "$0")"
echo "🛑 Parando servidor..."
pkill -f "next dev" 2>/dev/null
sleep 1
echo "🧹 Limpando cache .next..."
rm -rf .next
echo "🚀 Iniciando dev server limpo..."
npm run dev
