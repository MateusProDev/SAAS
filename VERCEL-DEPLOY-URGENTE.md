# 🚀 DEPLOY VERCEL - CONFIGURAÇÃO URGENTE

## ❌ ERRO IDENTIFICADO
```
`destination` does not start with `/`, `http://`, or `https://` for route {"source":"/api/:path*","destination":"undefined/:path*"}
```

**CAUSA**: Variável `NEXT_PUBLIC_API_URL` está undefined na Vercel.

## ✅ SOLUÇÃO IMEDIATA

### 1. **CONFIGURAR VARIÁVEIS NA VERCEL**

Acesse: https://vercel.com/dashboard → Seu projeto → Settings → Environment Variables

**ADICIONAR ESTAS VARIÁVEIS:**

```bash
# API Backend (OBRIGATÓRIO)
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com/api

# Firebase (OBRIGATÓRIAS) - CHAVES ATUALIZADAS
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCw2xYz9J_8v7LzQc6K5V3nN1mN2xP8rQ4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=turflow.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=turflow
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=turflow.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=283639909947
NEXT_PUBLIC_FIREBASE_APP_ID=1:283639909947:web:52506c5b1df8b18889d61e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-1HMMH0L3QH
```

### 2. **PASSOS DETALHADOS**

#### **Passo 1: Acessar Vercel**
```
1. Vá para: https://vercel.com/dashboard
2. Clique no seu projeto SAAS
3. Clique em "Settings"
4. Clique em "Environment Variables"
```

#### **Passo 2: Adicionar cada variável**
```
Para CADA variável acima:
1. Clique "Add New"
2. Name: (nome da variável, ex: NEXT_PUBLIC_API_URL)
3. Value: (valor da variável)
4. Environment: Marque TODOS (Production, Preview, Development)
5. Clique "Save"
```

#### **Passo 3: Deploy**
```
1. Após adicionar todas as variáveis
2. Vá para "Deployments"
3. Clique "Redeploy" no último deploy
4. Ou faça novo push no GitHub
```

## 🎯 CHECKLIST RÁPIDO

- [ ] NEXT_PUBLIC_API_URL configurada
- [ ] Todas as variáveis Firebase configuradas
- [ ] Environments marcados (Production/Preview/Development)
- [ ] Redeploy executado
- [ ] Build passando sem erros

## 🔧 ALTERNATIVA TEMPORÁRIA

Se não souber a URL do backend ainda, use:
```bash
NEXT_PUBLIC_API_URL=https://placeholder-api.vercel.app/api
```

Isso vai permitir o build passar. Depois você atualiza com a URL real do backend.

## 🚨 RESULTADO ESPERADO

Após configurar as variáveis:
```
✅ Build vai passar sem erros
✅ Deploy vai completar com sucesso  
✅ Site vai ficar online na Vercel
✅ Login/Register vão funcionar
```

---

**⏰ TEMPO ESTIMADO**: 5 minutos para configurar tudo!
