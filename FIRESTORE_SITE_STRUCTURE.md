# ESTRUTURA FIRESTORE PARA SITES DE CLIENTES

## Coleção: `sites`
Cada documento representa um site completo de um cliente.

### Documento ID: {siteId}
```json
{
  // === INFORMAÇÕES BÁSICAS ===
  "id": "string", // ID único do site
  "userId": "string", // ID do usuário/cliente
  "title": "string", // Nome do negócio/site
  "description": "string", // Descrição do negócio
  "template": "string", // Template escolhido
  "domain": "string", // Domínio personalizado (opcional)
  "status": "active|inactive|draft", // Status do site
  "plan": "free|premium|enterprise", // Plano do cliente
  
  // === INFORMAÇÕES DO NEGÓCIO ===
  "business": {
    "name": "string", // Nome da empresa
    "slogan": "string", // Slogan/tagline
    "category": "string", // Categoria do negócio
    "founded": "string", // Ano de fundação
    "employees": "number", // Número de funcionários
    "mission": "string", // Missão da empresa
    "vision": "string", // Visão da empresa
    "values": ["string"], // Valores da empresa
    "certifications": ["string"], // Certificações
    "awards": ["string"] // Prêmios recebidos
  },
  
  // === CONTATO E LOCALIZAÇÃO ===
  "contact": {
    "phone": "string", // Telefone principal
    "whatsapp": "string", // WhatsApp
    "email": "string", // Email principal
    "website": "string", // Site oficial
    "address": {
      "street": "string", // Rua
      "number": "string", // Número
      "complement": "string", // Complemento
      "neighborhood": "string", // Bairro
      "city": "string", // Cidade
      "state": "string", // Estado
      "zipCode": "string", // CEP
      "country": "string" // País
    },
    "coordinates": {
      "lat": "number", // Latitude
      "lng": "number" // Longitude
    }
  },
  
  // === REDES SOCIAIS ===
  "socialMedia": {
    "facebook": "string", // URL do Facebook
    "instagram": "string", // URL do Instagram
    "twitter": "string", // URL do Twitter
    "linkedin": "string", // URL do LinkedIn
    "youtube": "string", // URL do YouTube
    "tiktok": "string", // URL do TikTok
    "pinterest": "string" // URL do Pinterest
  },
  
  // === SERVIÇOS ===
  "services": [
    {
      "id": "string", // ID único do serviço
      "name": "string", // Nome do serviço
      "description": "string", // Descrição detalhada
      "price": "number", // Preço (opcional)
      "duration": "string", // Duração (ex: "30 min")
      "category": "string", // Categoria do serviço
      "image": "string", // URL da imagem
      "features": ["string"], // Características
      "popular": "boolean", // Serviço popular
      "available": "boolean", // Disponível
      "order": "number" // Ordem de exibição
    }
  ],
  
  // === PRODUTOS ===
  "products": [
    {
      "id": "string", // ID único do produto
      "name": "string", // Nome do produto
      "description": "string", // Descrição
      "price": "number", // Preço
      "salePrice": "number", // Preço promocional
      "category": "string", // Categoria
      "brand": "string", // Marca
      "images": ["string"], // URLs das imagens
      "specifications": {}, // Especificações técnicas
      "inStock": "boolean", // Em estoque
      "featured": "boolean", // Produto em destaque
      "order": "number" // Ordem de exibição
    }
  ],
  
  // === EQUIPE ===
  "team": [
    {
      "id": "string", // ID único do membro
      "name": "string", // Nome completo
      "role": "string", // Cargo/função
      "bio": "string", // Biografia
      "photo": "string", // URL da foto
      "specialties": ["string"], // Especialidades
      "experience": "string", // Anos de experiência
      "education": ["string"], // Formação
      "contact": {
        "email": "string",
        "phone": "string",
        "social": {}
      },
      "featured": "boolean", // Membro em destaque
      "order": "number" // Ordem de exibição
    }
  ],
  
  // === GALERIA ===
  "gallery": [
    {
      "id": "string", // ID único da imagem
      "title": "string", // Título da imagem
      "description": "string", // Descrição
      "url": "string", // URL da imagem
      "thumbnail": "string", // URL da thumbnail
      "category": "string", // Categoria
      "tags": ["string"], // Tags
      "featured": "boolean", // Imagem em destaque
      "order": "number" // Ordem de exibição
    }
  ],
  
  // === DEPOIMENTOS ===
  "testimonials": [
    {
      "id": "string", // ID único do depoimento
      "name": "string", // Nome do cliente
      "role": "string", // Cargo/empresa
      "photo": "string", // Foto do cliente
      "rating": "number", // Avaliação (1-5)
      "text": "string", // Texto do depoimento
      "service": "string", // Serviço avaliado
      "date": "timestamp", // Data do depoimento
      "featured": "boolean", // Depoimento em destaque
      "verified": "boolean", // Depoimento verificado
      "order": "number" // Ordem de exibição
    }
  ],
  
  // === HORÁRIO DE FUNCIONAMENTO ===
  "schedule": {
    "monday": {
      "open": "string", // Hora de abertura
      "close": "string", // Hora de fechamento
      "closed": "boolean" // Fechado no dia
    },
    "tuesday": {
      "open": "string",
      "close": "string",
      "closed": "boolean"
    },
    "wednesday": {
      "open": "string",
      "close": "string",
      "closed": "boolean"
    },
    "thursday": {
      "open": "string",
      "close": "string",
      "closed": "boolean"
    },
    "friday": {
      "open": "string",
      "close": "string",
      "closed": "boolean"
    },
    "saturday": {
      "open": "string",
      "close": "string",
      "closed": "boolean"
    },
    "sunday": {
      "open": "string",
      "close": "string",
      "closed": "boolean"
    },
    "holidays": ["string"], // Feriados especiais
    "notes": "string" // Observações especiais
  },
  
  // === CONFIGURAÇÕES DO SITE ===
  "settings": {
    "theme": {
      "primaryColor": "string", // Cor primária
      "secondaryColor": "string", // Cor secundária
      "fontFamily": "string", // Família da fonte
      "logo": "string", // URL do logo
      "favicon": "string" // URL do favicon
    },
    "seo": {
      "title": "string", // Título SEO
      "description": "string", // Descrição SEO
      "keywords": ["string"], // Palavras-chave
      "ogImage": "string" // Imagem Open Graph
    },
    "features": {
      "booking": "boolean", // Agendamento online
      "ecommerce": "boolean", // Loja online
      "blog": "boolean", // Blog
      "chat": "boolean", // Chat online
      "newsletter": "boolean", // Newsletter
      "reviews": "boolean", // Sistema de avaliações
      "multilanguage": "boolean" // Multi-idiomas
    },
    "integrations": {
      "googleAnalytics": "string", // ID do Google Analytics
      "facebookPixel": "string", // ID do Facebook Pixel
      "whatsappNumber": "string", // Número do WhatsApp
      "paymentGateway": "string" // Gateway de pagamento
    }
  },
  
  // === CONTEÚDO ADICIONAL ===
  "content": {
    "about": {
      "story": "string", // História da empresa
      "highlights": ["string"], // Destaques
      "achievements": ["string"] // Conquistas
    },
    "faq": [
      {
        "question": "string",
        "answer": "string",
        "category": "string",
        "order": "number"
      }
    ],
    "policies": {
      "privacy": "string", // Política de privacidade
      "terms": "string", // Termos de uso
      "return": "string" // Política de devolução
    }
  },
  
  // === METADADOS ===
  "metadata": {
    "createdAt": "timestamp", // Data de criação
    "updatedAt": "timestamp", // Última atualização
    "publishedAt": "timestamp", // Data de publicação
    "lastBackup": "timestamp", // Último backup
    "version": "string", // Versão do site
    "views": "number", // Visualizações
    "leads": "number", // Leads gerados
    "conversions": "number" // Conversões
  }
}
```

## Exemplo Prático - Barbearia

```json
{
  "id": "barbearia-classic-style",
  "userId": "user123",
  "title": "Classic Style Barbearia",
  "description": "A melhor barbearia da região com mais de 20 anos de tradição",
  "template": "barbearia",
  "status": "active",
  "plan": "premium",
  
  "business": {
    "name": "Classic Style Barbearia",
    "slogan": "Tradição e estilo em cada corte",
    "category": "Beleza & Cuidados",
    "founded": "2003",
    "employees": 8,
    "mission": "Proporcionar a melhor experiência em cuidados masculinos",
    "vision": "Ser referência em barbearia premium",
    "values": ["Qualidade", "Tradição", "Excelência"],
    "certifications": ["SENAC", "SEBRAE"],
    "awards": ["Melhor Barbearia 2023"]
  },
  
  "contact": {
    "phone": "(11) 99999-9999",
    "whatsapp": "(11) 99999-9999",
    "email": "contato@classicstyle.com.br",
    "address": {
      "street": "Rua Augusta",
      "number": "1234",
      "neighborhood": "Consolação",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01305-100",
      "country": "Brasil"
    }
  },
  
  "services": [
    {
      "id": "corte-tradicional",
      "name": "Corte Tradicional",
      "description": "Corte clássico com tesoura e navalha",
      "price": 35,
      "duration": "45 min",
      "category": "Cortes",
      "features": ["Lavagem", "Finalização", "Toalha quente"],
      "popular": true,
      "available": true,
      "order": 1
    },
    {
      "id": "barba-completa",
      "name": "Barba Completa",
      "description": "Barba aparada e hidratada profissionalmente",
      "price": 25,
      "duration": "30 min",
      "category": "Barba",
      "features": ["Toalha quente", "Óleos essenciais", "Hidratação"],
      "popular": true,
      "available": true,
      "order": 2
    }
  ],
  
  "team": [
    {
      "id": "joao-master",
      "name": "João Silva",
      "role": "Barbeiro Master",
      "bio": "Mais de 15 anos de experiência",
      "specialties": ["Cortes clássicos", "Barba", "Bigode"],
      "experience": "15 anos",
      "featured": true,
      "order": 1
    }
  ],
  
  "schedule": {
    "monday": { "open": "08:00", "close": "18:00", "closed": false },
    "tuesday": { "open": "08:00", "close": "18:00", "closed": false },
    "wednesday": { "open": "08:00", "close": "18:00", "closed": false },
    "thursday": { "open": "08:00", "close": "18:00", "closed": false },
    "friday": { "open": "08:00", "close": "19:00", "closed": false },
    "saturday": { "open": "08:00", "close": "17:00", "closed": false },
    "sunday": { "open": "", "close": "", "closed": true }
  },
  
  "settings": {
    "theme": {
      "primaryColor": "#8B4513",
      "secondaryColor": "#D2691E",
      "fontFamily": "Playfair Display"
    },
    "features": {
      "booking": true,
      "chat": true,
      "reviews": true
    }
  }
}
```
