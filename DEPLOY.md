# Guia de Deploy - SaaS Website Builder

## 🚀 Deploy do Backend (Render)

### 1. Preparar o Backend
```bash
cd backend
cp .env.example .env
# Configure as variáveis de ambiente no arquivo .env
```

### 2. Deploy no Render
1. Acesse [render.com](https://render.com)
2. Conecte seu GitHub
3. Crie um novo "Web Service"
4. Selecione seu repositório
5. Configure:
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `./`

### 3. Variáveis de Ambiente no Render
Configure no Dashboard do Render:
- `PORT` = 10000 (automático)
- `NODE_ENV` = production
- `FIREBASE_PROJECT_ID` = seu-project-id
- `FIREBASE_PRIVATE_KEY` = sua-private-key
- `FIREBASE_CLIENT_EMAIL` = seu-client-email
- `CLOUDINARY_CLOUD_NAME` = seu-cloud-name
- `CLOUDINARY_API_KEY` = sua-api-key
- `CLOUDINARY_API_SECRET` = seu-api-secret

---

## 🌐 Deploy do Frontend (Vercel)

### 1. Preparar o Frontend
```bash
cd frontend
cp .env.example .env.local
# Configure as variáveis de ambiente
```

### 2. Deploy na Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Ou conectar pelo GitHub na interface web
```

### 3. Variáveis de Ambiente na Vercel
Configure no Dashboard da Vercel:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_API_URL` = https://seu-backend.onrender.com
- `REACT_APP_CLOUDINARY_CLOUD_NAME`

---

## 🔥 Configuração Firebase

### 1. Criar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto
3. Ative Authentication (Email/Password)
4. Ative Firestore Database

### 2. Configurar Authentication
- Ative "Email/Password" em Authentication > Sign-in method

### 3. Configurar Firestore
Regras de segurança:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem acessar apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Sites do usuário
      match /sites/{siteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Sites públicos (apenas leitura)
    match /sites/{siteId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Obter Credenciais
- **Frontend**: Project Settings > General > Firebase SDK snippet
- **Backend**: Project Settings > Service Accounts > Generate new private key

---

## ☁️ Configuração Cloudinary

### 1. Criar Conta
1. Acesse [cloudinary.com](https://cloudinary.com)
2. Crie conta gratuita
3. Acesse Dashboard

### 2. Obter Credenciais
- Cloud Name
- API Key  
- API Secret

### 3. Configurar Presets (opcional)
- Upload presets para otimização automática
- Transformações de imagem

---

## 🗺️ Domínio Personalizado (Futuro)

### Para Vercel
1. Adicionar domínio no projeto Vercel
2. Configurar DNS do domínio

### Para Sites Gerados
- Implementar subdomínios dinâmicos
- Ou sistema de paths personalizados

---

## 📊 Monitoramento

### Logs Backend (Render)
- Logs automáticos no dashboard Render
- Alertas por email em caso de erro

### Analytics Frontend
- Google Analytics (implementação futura)
- Vercel Analytics

---

## 🔐 Segurança

### Backend
- ✅ Helmet.js para headers de segurança
- ✅ CORS configurado
- ✅ Rate limiting (implementar no futuro)
- ✅ Validação de dados

### Frontend
- ✅ Variáveis de ambiente
- ✅ Autenticação Firebase
- ✅ Rotas protegidas

---

## 📝 Checklist de Deploy

### Backend
- [ ] Configurar variáveis de ambiente
- [ ] Testar localmente
- [ ] Deploy no Render
- [ ] Testar endpoints da API
- [ ] Configurar domínio (se necessário)

### Frontend
- [ ] Configurar variáveis de ambiente
- [ ] Atualizar URL da API
- [ ] Build de produção local
- [ ] Deploy na Vercel
- [ ] Testar funcionalidades
- [ ] Configurar domínio (se necessário)

### Firebase
- [ ] Projeto criado
- [ ] Authentication configurado
- [ ] Firestore configurado
- [ ] Regras de segurança aplicadas
- [ ] Credenciais obtidas

### Cloudinary
- [ ] Conta criada
- [ ] Credenciais obtidas
- [ ] Teste de upload

---

## 🆘 Troubleshooting

### Erros Comuns
1. **CORS Error**: Verificar configuração de domínios permitidos
2. **Firebase Auth Error**: Verificar configuração do projeto
3. **Build Error**: Verificar variáveis de ambiente
4. **Upload Error**: Verificar credenciais Cloudinary

### Logs Úteis
- Browser DevTools (Network, Console)
- Render Logs
- Vercel Function Logs
- Firebase Console (Authentication, Firestore)
