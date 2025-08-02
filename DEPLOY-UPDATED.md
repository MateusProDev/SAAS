# 🚀 Guia de Deploy - SaaS Website Builder

## 📋 **Pré-requisitos**
- Conta GitHub
- Conta Vercel (para frontend)
- Conta Render (para backend)
- Projeto Firebase configurado
- Conta Cloudinary configurada

## 🔥 **1. Firebase Admin SDK (Para Backend)**

### 1.1 Gerar Service Account Key
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione projeto `turflow`
3. Vá em **Project Settings** > **Service accounts**
4. Clique em **Generate new private key**
5. Baixe o arquivo JSON

### 1.2 Extrair credenciais do JSON:
```json
{
  "project_id": "turflow",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-...@turflow.iam.gserviceaccount.com",
  "client_id": "..."
}
```

## 🚀 **2. Deploy Frontend (Vercel)**

### 2.1 Conectar repositório à Vercel
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **New Project**
3. Conecte seu repositório GitHub `MateusProDev/SAAS`
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.2 Configurar Environment Variables

**⚠️ IMPORTANTE**: No Vercel, vá em **Settings** > **Environment Variables** e adicione cada variável individualmente:

| Variável | Valor |
|----------|-------|
| `VITE_FIREBASE_API_KEY` | `SUA_NOVA_CHAVE_API_FIREBASE_AQUI` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `turflow.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `turflow` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `turflow.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `283639909947` |
| `VITE_FIREBASE_APP_ID` | `1:283639909947:web:52506c5b1df8b18889d61e` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-1HMMH0L3QH` |
| `VITE_API_URL` | `https://seu-backend.onrender.com/api` |

**🔧 Passos no Vercel:**
1. Acesse seu projeto na Vercel
2. Vá em **Settings** > **Environment Variables**
3. Para cada variável:
   - Nome: Cole o nome exato (ex: `VITE_FIREBASE_API_KEY`)
   - Valor: Cole o valor correspondente
   - Environment: Selecione **Production**, **Preview** e **Development**
   - Clique **Save**

**❌ NÃO use "Secrets"** - apenas Environment Variables normais!

## 🛠️ **3. Deploy Backend (Render)**

### 3.1 Criar Web Service
1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **New** > **Web Service**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `saas-website-builder-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3.2 Configurar Environment Variables
```bash
# Server
PORT=5000
NODE_ENV=production

# Firebase Admin SDK (cole os valores do JSON baixado)
FIREBASE_PROJECT_ID=turflow
FIREBASE_PRIVATE_KEY_ID=cole_aqui_o_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ncole_aqui_a_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@turflow.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=cole_aqui_o_client_id

# Cloudinary
CLOUDINARY_CLOUD_NAME=dhiazdqkj
CLOUDINARY_API_KEY=631923265877232
CLOUDINARY_API_SECRET=K7AIivPOqX3RQA-cfNEKxbQgIYE

# CORS (atualize após deploy do frontend)
FRONTEND_URL=https://seu-frontend.vercel.app
```

## 🔄 **4. Configurar URLs cruzadas**

### 4.1 Após deploy do backend:
1. Copie a URL do Render (ex: `https://saas-backend-xyz.onrender.com`)
2. Atualize no Vercel: `VITE_API_URL=https://saas-backend-xyz.onrender.com/api`

### 4.2 Após deploy do frontend:
1. Copie a URL da Vercel (ex: `https://saas-frontend-xyz.vercel.app`)
2. Atualize no Render: `FRONTEND_URL=https://saas-frontend-xyz.vercel.app`

## 🔒 **5. Configurações de Segurança Firebase**

### 5.1 Authorized domains:
1. Firebase Console > Authentication > Settings
2. Adicione seus domínios:
   - `localhost` (desenvolvimento)
   - `sua-url.vercel.app` (produção)

### 5.2 Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regra para usuários autenticados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regra para sites do usuário
    match /sites/{siteId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Sites públicos (apenas leitura)
    match /public-sites/{siteId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## ✅ **6. Verificação pós-deploy**

### 6.1 Testes:
- [ ] Frontend carrega corretamente
- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] API responde corretamente
- [ ] Upload de imagens funciona

### 6.2 URLs finais:
- **Frontend**: `https://seu-projeto.vercel.app`
- **Backend**: `https://seu-backend.onrender.com`
- **API Docs**: `https://seu-backend.onrender.com/api`

## 🐛 **7. Troubleshooting**

### 🚨 **ERRO CRÍTICO: Environment Variable references Secret that does not exist**

**Problema**: `Environment Variable "VITE_FIREBASE_API_KEY" references Secret "vite_firebase_api_key", which does not exist.`

## 🔧 **SOLUÇÃO COMPLETA - Siga EXATAMENTE estes passos:**

### **Passo 1: DELETAR TODAS as Environment Variables problemáticas**
1. Acesse **Vercel Dashboard** → Seu projeto
2. Clique em **Settings** (menu lateral)
3. Clique em **Environment Variables**
4. **DELETE/REMOVA** uma por uma todas essas variáveis:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

### **Passo 2: ADICIONAR uma por vez - MÉTODO CORRETO**

**Para CADA variável, faça EXATAMENTE assim:**

1. Clique **"Add New"**
2. **Name**: `VITE_FIREBASE_API_KEY` (cole exato, sem aspas)
3. **Value**: `SUA_NOVA_CHAVE_API_FIREBASE_AQUI` (cole exato, sem aspas)
4. **Environments**: Marque TODOS (Production, Preview, Development)
5. **NÃO** marque "Sensitive"
6. **NÃO** selecione nenhum "Secret"
7. Clique **"Save"**

**Repita para todas:**
- `VITE_FIREBASE_AUTH_DOMAIN` = `turflow.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID` = `turflow`
- `VITE_FIREBASE_STORAGE_BUCKET` = `turflow.firebasestorage.app`
- `VITE_FIREBASE_MESSAGING_SENDER_ID` = `283639909947`
- `VITE_FIREBASE_APP_ID` = `1:283639909947:web:52506c5b1df8b18889d61e`
- `VITE_FIREBASE_MEASUREMENT_ID` = `G-1HMMH0L3QH`

### **Passo 3: VERIFICAR se não há referência a Secrets**
- Cada variável deve mostrar o valor diretamente
- **NÃO** deve aparecer "references Secret xyz"
- Se aparecer, DELETE e refaça

### **Passo 4: FORCE REDEPLOY**
1. Vá em **Deployments**
2. Clique nos **3 pontos** do último deploy
3. **"Redeploy"**
4. Selecione **"Use existing Build Cache"**
5. Confirme **"Redeploy"**

## ⚠️ **SE AINDA DER ERRO:**

### **Opção A: Limpar TUDO do projeto**
1. Delete o projeto inteiro do Vercel
2. Crie um novo projeto
3. Conecte o GitHub novamente
4. Configure Root Directory: `frontend`
5. Adicione as variáveis do zero

### **Opção B: Usar Vercel CLI**
```bash
npx vercel env add VITE_FIREBASE_API_KEY
# Cole: SUA_NOVA_CHAVE_API_FIREBASE_AQUI
# Selecione: production, preview, development
```

### Problemas comuns:
1. **CORS Error**: Verifique `FRONTEND_URL` no backend
2. **Firebase Auth Error**: Verifique authorized domains
3. **Build Error**: Verifique environment variables
4. **API 500**: Verifique logs do Render e credenciais Firebase

### Logs úteis:
- **Vercel**: Function logs no dashboard
- **Render**: Service logs no dashboard
- **Firebase**: Console > Functions logs

---

## 🎉 **Deploy automatizado!**

Após configuração inicial, qualquer push para `main` dispara:
- ✅ Build automático na Vercel
- ✅ Deploy automático no Render
- ✅ Invalidação de cache

**Seu SaaS está no ar! 🚀**
