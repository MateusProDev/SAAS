# 🚨 SOLUÇÃO ALTERNATIVA - Vercel CLI

Se o método manual não funcionar, use o Vercel CLI:

## 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

## 2. Login no Vercel
```bash
vercel login
```

## 3. Navegar para frontend
```bash
cd frontend
```

## 4. Linkar projeto
```bash
vercel link
```

## 5. Adicionar environment variables uma por uma
```bash
vercel env add VITE_FIREBASE_API_KEY
# Cole: SUA_NOVA_CHAVE_API_FIREBASE_AQUI
# Selecione: production, preview, development

vercel env add VITE_FIREBASE_AUTH_DOMAIN
# Cole: turflow.firebaseapp.com
# Selecione: production, preview, development

vercel env add VITE_FIREBASE_PROJECT_ID
# Cole: turflow
# Selecione: production, preview, development

vercel env add VITE_FIREBASE_STORAGE_BUCKET
# Cole: turflow.firebasestorage.app
# Selecione: production, preview, development

vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
# Cole: 283639909947
# Selecione: production, preview, development

vercel env add VITE_FIREBASE_APP_ID
# Cole: 1:283639909947:web:52506c5b1df8b18889d61e
# Selecione: production, preview, development

vercel env add VITE_FIREBASE_MEASUREMENT_ID
# Cole: G-1HMMH0L3QH
# Selecione: production, preview, development
```

## 6. Deploy
```bash
vercel --prod
```

## 📋 VALORES PARA COPIAR/COLAR:

- **VITE_FIREBASE_API_KEY**: `SUA_NOVA_CHAVE_API_FIREBASE_AQUI`
- **VITE_FIREBASE_AUTH_DOMAIN**: `turflow.firebaseapp.com`
- **VITE_FIREBASE_PROJECT_ID**: `turflow`
- **VITE_FIREBASE_STORAGE_BUCKET**: `turflow.firebasestorage.app`
- **VITE_FIREBASE_MESSAGING_SENDER_ID**: `283639909947`
- **VITE_FIREBASE_APP_ID**: `1:283639909947:web:52506c5b1df8b18889d61e`
- **VITE_FIREBASE_MEASUREMENT_ID**: `G-1HMMH0L3QH`

Para cada variável, quando o CLI perguntar os environments, digite: **production,preview,development**
