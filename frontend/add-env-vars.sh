#!/bin/bash

echo "Configurando todas as environment variables..."

# VITE_FIREBASE_AUTH_DOMAIN
echo "turflow.firebaseapp.com" | vercel env add VITE_FIREBASE_AUTH_DOMAIN

# VITE_FIREBASE_PROJECT_ID  
echo "turflow" | vercel env add VITE_FIREBASE_PROJECT_ID

# VITE_FIREBASE_STORAGE_BUCKET
echo "turflow.firebasestorage.app" | vercel env add VITE_FIREBASE_STORAGE_BUCKET

# VITE_FIREBASE_MESSAGING_SENDER_ID
echo "283639909947" | vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID

# VITE_FIREBASE_APP_ID
echo "1:283639909947:web:52506c5b1df8b18889d61e" | vercel env add VITE_FIREBASE_APP_ID

# VITE_FIREBASE_MEASUREMENT_ID
echo "G-1HMMH0L3QH" | vercel env add VITE_FIREBASE_MEASUREMENT_ID

echo "Configuração completa!"
