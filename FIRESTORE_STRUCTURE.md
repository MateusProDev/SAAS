# Estrutura do Firebase Firestore - SaaS Website Builder

## 📋 Instruções para configurar o Firestore

### 1. Acesse o Firebase Console
- Vá para https://console.firebase.google.com/
- Selecione seu projeto "turflow"
- Navegue até "Firestore Database"

### 2. Criar o banco de dados Firestore
- Clique em "Criar banco de dados"
- Escolha "Modo de produção" ou "Modo de teste" (recomendo teste para desenvolvimento)
- Selecione a localização (recomendo us-central1 ou southamerica-east1 para Brasil)

## 📁 Estrutura de Coleções e Documentos

### Coleção: `users`
**Caminho:** `/users/{userId}`

**Estrutura de documento:**
```javascript
{
  uid: string,           // ID do usuário (mesmo do Authentication)
  email: string,         // Email do usuário
  displayName: string,   // Nome de exibição
  createdAt: timestamp,  // Data de criação
  updatedAt: timestamp,  // Data de última atualização
  plan: string,          // Plano do usuário ("free", "pro", "premium")
  maxSites: number,      // Número máximo de sites permitidos
  activeUntil: timestamp // Data até quando o plano está ativo
}
```

**Exemplo:**
```javascript
// Documento: /users/abc123def456
{
  uid: "abc123def456",
  email: "usuario@email.com",
  displayName: "João Silva",
  createdAt: firebase.firestore.Timestamp,
  updatedAt: firebase.firestore.Timestamp,
  plan: "free",
  maxSites: 3,
  activeUntil: firebase.firestore.Timestamp
}
```

### Subcoleção: `users/{userId}/sites`
**Caminho:** `/users/{userId}/sites/{siteId}`

**Estrutura de documento:**
```javascript
{
  id: string,           // ID único do site
  title: string,        // Título do site
  description: string,  // Descrição do site
  content: string,      // HTML completo do site
  published: boolean,   // Se o site está publicado
  slug: string,         // URL amigável (ex: "meu-site")
  customDomain: string, // Domínio customizado (opcional)
  template: string,     // Template usado ("blank", "business", "portfolio")
  settings: object,     // Configurações do site
  seo: object,          // Configurações de SEO
  analytics: object,    // Dados de analytics
  userId: string,       // ID do usuário dono
  createdAt: timestamp, // Data de criação
  updatedAt: timestamp, // Data de última atualização
  lastPublished: timestamp // Data da última publicação
}
```

**Exemplo:**
```javascript
// Documento: /users/abc123def456/sites/site001
{
  id: "site001",
  title: "Minha Empresa",
  description: "Site da minha empresa de tecnologia",
  content: "<!DOCTYPE html>...",
  published: true,
  slug: "minha-empresa",
  customDomain: "",
  template: "business",
  settings: {
    theme: "light",
    primaryColor: "#3B82F6",
    secondaryColor: "#1F2937",
    fontFamily: "Inter"
  },
  seo: {
    metaTitle: "Minha Empresa - Soluções em Tecnologia",
    metaDescription: "Oferecemos as melhores soluções em tecnologia",
    keywords: ["tecnologia", "empresa", "soluções"],
    ogImage: "https://cloudinary.com/image.jpg"
  },
  analytics: {
    views: 156,
    uniqueVisitors: 89,
    lastVisit: firebase.firestore.Timestamp
  },
  userId: "abc123def456",
  createdAt: firebase.firestore.Timestamp,
  updatedAt: firebase.firestore.Timestamp,
  lastPublished: firebase.firestore.Timestamp
}
```

### Coleção: `templates`
**Caminho:** `/templates/{templateId}`

**Estrutura de documento:**
```javascript
{
  id: string,           // ID único do template
  name: string,         // Nome do template
  description: string,  // Descrição do template
  category: string,     // Categoria ("business", "portfolio", "blog", etc.)
  content: string,      // HTML base do template
  preview: string,      // URL da imagem de preview
  featured: boolean,    // Se é template em destaque
  free: boolean,        // Se é gratuito ou premium
  tags: array,          // Tags para filtros
  createdAt: timestamp, // Data de criação
  updatedAt: timestamp  // Data de atualização
}
```

### Coleção: `published_sites`
**Caminho:** `/published_sites/{slug}`

**Estrutura de documento:**
```javascript
{
  slug: string,         // URL amigável
  siteId: string,       // ID do site original
  userId: string,       // ID do usuário dono
  title: string,        // Título do site
  content: string,      // HTML publicado
  publishedAt: timestamp, // Data de publicação
  views: number,        // Número de visualizações
  active: boolean       // Se está ativo
}
```

## 🔐 Regras de Segurança do Firestore

Copie e cole estas regras no Firebase Console > Firestore > Regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Regras para sites do usuário
      match /sites/{siteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Regras para templates (todos podem ler)
    match /templates/{templateId} {
      allow read: if true;
      allow write: if false; // Apenas admins podem criar templates
    }
    
    // Regras para sites publicados (todos podem ler)
    match /published_sites/{slug} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📊 Índices Compostos Necessários

Vá em Firestore > Índices e crie estes índices compostos:

### 1. Para buscar sites do usuário ordenados por data
- **Coleção:** `users/{userId}/sites`
- **Campos:** 
  - `userId` (Crescente)
  - `createdAt` (Decrescente)

### 2. Para buscar sites publicados
- **Coleção:** `published_sites`
- **Campos:**
  - `active` (Crescente)
  - `publishedAt` (Decrescente)

### 3. Para buscar templates por categoria
- **Coleção:** `templates`
- **Campos:**
  - `category` (Crescente)
  - `featured` (Decrescente)
  - `createdAt` (Decrescente)

## 🚀 Próximos Passos

1. **Configure a estrutura no Firestore**
2. **Aplique as regras de segurança**
3. **Crie os índices compostos**
4. **Teste a criação de sites no dashboard**

## 📝 Dados de Exemplo para Testar

Você pode criar alguns templates de exemplo:

```javascript
// Template Business
{
  id: "business-01",
  name: "Business Modern",
  description: "Template moderno para empresas",
  category: "business",
  content: "<!DOCTYPE html>...", // HTML completo
  preview: "https://example.com/preview1.jpg",
  featured: true,
  free: true,
  tags: ["moderno", "empresa", "corporativo"],
  createdAt: firebase.firestore.Timestamp.now(),
  updatedAt: firebase.firestore.Timestamp.now()
}
```

Agora você pode criar essa estrutura no Firebase Console e testar a criação de sites!
