@echo off
echo ===================================
echo VERCEL - CONFIGURAR ENV VARIABLES
echo ===================================
echo.
echo Este script vai configurar as environment variables via Vercel CLI
echo.
pause

echo Instalando Vercel CLI...
npm install -g vercel

echo.
echo Fazendo login no Vercel...
vercel login

echo.
echo Navegando para o diretorio frontend...
cd frontend

echo.
echo Linkando o projeto...
vercel link

echo.
echo Configurando environment variables...
echo.

echo Configurando VITE_FIREBASE_API_KEY...
vercel env add VITE_FIREBASE_API_KEY

echo.
echo Configurando VITE_FIREBASE_AUTH_DOMAIN...
vercel env add VITE_FIREBASE_AUTH_DOMAIN

echo.
echo Configurando VITE_FIREBASE_PROJECT_ID...
vercel env add VITE_FIREBASE_PROJECT_ID

echo.
echo Configurando VITE_FIREBASE_STORAGE_BUCKET...
vercel env add VITE_FIREBASE_STORAGE_BUCKET

echo.
echo Configurando VITE_FIREBASE_MESSAGING_SENDER_ID...
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID

echo.
echo Configurando VITE_FIREBASE_APP_ID...
vercel env add VITE_FIREBASE_APP_ID

echo.
echo Configurando VITE_FIREBASE_MEASUREMENT_ID...
vercel env add VITE_FIREBASE_MEASUREMENT_ID

echo.
echo Fazendo deploy...
vercel --prod

echo.
echo ===================================
echo CONFIGURACAO COMPLETA!
echo ===================================
pause
