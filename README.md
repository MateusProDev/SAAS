# SAAS - Plataforma de Criação de Portfólios Profissionais

Este projeto é uma plataforma SaaS moderna para criação, edição e publicação de portfólios profissionais, voltada para qualquer área (devs, médicos, advogados, designers, etc). O sistema é construído com Next.js, React, Firebase e Vercel, com foco em UI/UX premium, responsividade e facilidade de uso.

## Estrutura de Pastas

- **frontend/**  
  Aplicação principal Next.js. Contém todo o código do frontend, estilos, páginas, componentes e hooks.
  - **app/**  
    Estrutura de rotas e páginas do Next.js 13+.
    - **dashboard/**  
      Página principal do usuário, com cards dos sites criados, botão destacado "+ Novo site", alternância de tema (dark/light), status dos sites (rascunho/ativo), e ações rápidas.
    - **edit-site/**  
      Editor completo para qualquer template, incluindo portfólio.
    - **preview/**  
      Visualização pública dos sites criados.
    - **sites/**  
      Listagem de todos os sites do usuário, criação de novo site, rotas dinâmicas por ID.
    - **login/**, **register/**  
      Autenticação de usuários.
    - **public/**  
      Visualização pública por slug.
    - **globals.css**, **custom-improvements.css**, **reset.css**  
      Estilos globais e resets.
  - **src/**  
    Código fonte dos componentes, hooks, templates e utilitários.
    - **components/**  
      Componentes reutilizáveis: editor de portfólio, formulário de contato, carrossel, badges de plano, etc.
    - **hooks/**  
      Hooks customizados para autenticação, dados do portfólio, integração com Firestore, etc.
    - **templates/**  
      Templates prontos para diferentes tipos de site (portfólio, comercial, agência, etc).
    - **contexts/**  
      Contextos globais (ex: plano do usuário).
    - **utils/**  
      Funções utilitárias e helpers.
  - **public/**  
    Arquivos estáticos, ícones, manifestos, imagens.
  - **.next/**  
    Arquivos de build do Next.js (gerados automaticamente).
  - **package.json**, **tsconfig.json**, **next.config.js**  
    Configurações do projeto.

## Principais Funcionalidades

- Criação de portfólios profissionais com templates modernos e responsivos.
- Editor visual completo para personalização de dados, temas, seções e projetos.
- Dashboard com cards de sites, status, ações rápidas e botão destacado "+ Novo site".
- Alternância de tema (dark/light) com ícone de sol/lua.
- Visualização pública por slug ou ID.
- Formulário de contato estilizado e seguro.
- Autenticação de usuários.
- Sincronização automática dos dados com Firestore (users, published_sites, slugs).
- Suporte a múltiplos templates e áreas profissionais.
- UI/UX premium, animações suaves, microinterações e acessibilidade.

## Como rodar localmente

```bash
cd frontend
npm install
npm run dev
```

## Deploy

O deploy é feito automaticamente via Vercel, conectado ao GitHub.  
Para publicar manualmente, faça push para a branch principal.

## Observações

- O projeto já está pronto para produção, com responsividade, acessibilidade e performance otimizadas.
- Para personalizar templates, edite os arquivos em `src/templates/`.
- Para adicionar integrações, utilize os hooks em `src/hooks/`.
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
- Backend: Vercel (Node.js API pode ser hospedada como Serverless Function ou API Route)

## 🌐 Variáveis de Ambiente (Vercel)

Configure as variáveis de ambiente diretamente no painel da Vercel para frontend e backend:

**Frontend (.env):**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=https://your-vercel-backend.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

**Backend (.env):**
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=your_client_email
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
v=your_mp_token
```

> Recomenda-se usar o painel de variáveis da Vercel para maior segurança e praticidade.

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