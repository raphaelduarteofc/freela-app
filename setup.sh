#!/bin/bash
# =====================================================
# Freela — Setup Script
# Roda tudo de uma vez: instala deps, cria .env.local
# =====================================================

set -e

echo ""
echo "🚀 Freela Setup"
echo "==============="

# Vai para a pasta do projeto
cd "$(dirname "$0")"

# 1. Instala dependências
echo ""
echo "📦 Instalando dependências npm..."
npm install

# 2. Cria .env.local se não existir
if [ ! -f .env.local ]; then
  echo ""
  echo "📄 Criando .env.local a partir do exemplo..."
  cp .env.local.example .env.local
  echo "✅ .env.local criado — edite com suas credenciais do Supabase"
else
  echo ""
  echo "✅ .env.local já existe"
fi

echo ""
echo "================================================"
echo "✅ Setup concluído!"
echo ""
echo "Próximo passo:"
echo "  1. Abra .env.local e preencha as credenciais do Supabase"
echo "  2. Rode: npm run dev"
echo "  3. Acesse: http://localhost:3000"
echo "================================================"
echo ""
