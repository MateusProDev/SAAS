#!/bin/bash

# Script para atualizar regras do Firestore
# Execute este script ou siga os passos manuais abaixo

echo "🔧 ATUALIZANDO REGRAS DO FIRESTORE"
echo ""
echo "OPÇÃO 1 - Via Firebase CLI (se instalado):"
echo "firebase deploy --only firestore:rules"
echo ""
echo "OPÇÃO 2 - Manual via Firebase Console:"
echo "1. Acesse: https://console.firebase.google.com"
echo "2. Selecione seu projeto"
echo "3. Vá em Firestore Database"
echo "4. Clique na aba 'Rules'"
echo "5. Cole o conteúdo do arquivo firestore.rules"
echo "6. Clique em 'Publish'"
echo ""
echo "⚠️  IMPORTANTE: Essas regras são para DESENVOLVIMENTO"
echo "   Em produção, use regras mais restritivas!"
echo ""

# Se o Firebase CLI estiver instalado, tenta fazer deploy
if command -v firebase &> /dev/null; then
    echo "🚀 Firebase CLI encontrado! Executando deploy..."
    firebase deploy --only firestore:rules
else
    echo "💡 Firebase CLI não encontrado. Use a opção manual."
fi
