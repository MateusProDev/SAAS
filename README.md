# SaaS Website Builder

Um gerador de sites comerciais estáticos usando React, Firebase, Node.js e Vercel.

## 🚀 Funcionalidades

### MVP - Criador de Sites Estáticos
- ✅ Autenticação com Firebase (email/senha)
- ✅ Painel administrativo para customização
- ✅ Templates pré-configurados (Barbearia, Agência de Turismo, Site Comercial)
- ✅ Editor de textos, imagens e cores
- ✅ Upload de imagens via Cloudinary
- ✅ Preview em tempo real
- ✅ Publicação de sites estáticos
- ✅ Armazenamento no Firestore

### Templates Disponíveis
1. **Barbearia** - Foco em agendamento e redes sociais
2. **Agência de Turismo** - Pacotes e botão WhatsApp
3. **Site Comercial** - Institucional com sobre e contato

## 🛠️ Tecnologias

**Frontend:**
- React (Create React App)
- React Router DOM
- Firebase Auth & Firestore
- Styled Components
- React Colorful

**Backend:**
- Node.js + Express
- Firebase Admin
- Cloudinary (upload de imagens)
- Cors, Helmet, Morgan

**Deploy:**
- Frontend: Vercel
- Backend: Render

## 📁 Estrutura do Projeto

```
/frontend          # React App
  /src
    /components    # Componentes reutilizáveis
    /pages        # Páginas principais
    /templates    # Templates de sites
    /services     # Firebase, API calls
    /utils        # Utilitários
    /hooks        # Custom hooks
/backend          # Node.js API
  /routes         # Rotas da API
  /middleware     # Middlewares
  /utils          # Utilitários do backend
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

**Frontend (.env):**
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

**Backend (.env):**
```env
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=your_client_email
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Instalação

```bash
# Instalar dependências do frontend
cd frontend
npm install

# Instalar dependências do backend
cd ../backend
npm install
```

### 3. Executar em Desenvolvimento

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🔮 Futuras Melhorias

- [ ] Domínios personalizados
- [ ] Planos pagos (Stripe/MercadoPago)
- [ ] Dashboard com Analytics
- [ ] Mais templates
- [ ] Editor visual drag-and-drop
- [ ] SEO otimizado
- [ ] PWA support

## 📝 Licença

MIT License