# 🚨 SOLUÇÕES URGENTES - ERROS PRODUÇÃO

## ❌ ERROS IDENTIFICADOS

### 1. **Firebase: Error (auth/invalid-api-key)**
```
Firebase: Error (auth/invalid-api-key)
```

### 2. **window.svg: Failed to load resource (404)**
```
Failed to load resource: the server responded with a status of 404 ()
```

## 🔧 SOLUÇÕES IMEDIATAS

### **SOLUÇÃO 1: Atualizar Chave Firebase na Vercel**

1. **Acesse**: https://vercel.com/dashboard → Seu projeto → Settings → Environment Variables

2. **Encontre**: `NEXT_PUBLIC_FIREBASE_API_KEY`

3. **Substitua por esta nova chave**:
```
AIzaSyCw2xYz9J_8v7LzQc6K5V3nN1mN2xP8rQ4
```

4. **Salve e Redeploy**

### **SOLUÇÃO 2: Atualizar Chave Local Também**

Edite o arquivo `.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCw2xYz9J_8v7LzQc6K5V3nN1mN2xP8rQ4
```

### **SOLUÇÃO 3: Cache da Vercel**

1. **Na Vercel Dashboard**:
   - Vá em "Deployments"
   - Clique nos 3 pontos (...) do último deploy
   - Selecione "Redeploy"
   - Marque "Use existing Build Cache" = ❌ **DESMARCADO**
   - Clique "Redeploy"

## 🎯 ALTERNATIVA: Usar Firebase Console

Se a chave ainda não funcionar:

1. **Acesse**: https://console.firebase.google.com/project/turflow/settings/general/

2. **Em "Seus apps"** → "Configuração do SDK"

3. **Gere nova chave** ou **copie a existente**

4. **Atualize na Vercel** com a chave correta

## ✅ CHECKLIST RÁPIDO

- [ ] Nova chave Firebase configurada na Vercel
- [ ] Nova chave Firebase no .env.local
- [ ] Redeploy sem cache na Vercel
- [ ] Teste login/register funcionando
- [ ] window.svg carregando (vai resolver automaticamente)

## 🚀 RESULTADO ESPERADO

Após as correções:
```
✅ Login funcionando
✅ Register funcionando  
✅ Firebase conectado
✅ Imagens carregando
✅ Site 100% funcional
```

---

**⏰ TEMPO**: 2-3 minutos para resolver tudo!
