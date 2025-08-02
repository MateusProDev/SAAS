# 🔒 REGRAS DE SEGURANÇA FIRESTORE - MABELSOFT SAAS

## 📋 VISÃO GERAL DAS REGRAS

### **✅ O QUE FOI IMPLEMENTADO:**

#### **1. 👤 USUÁRIOS (/users/{userId})**
```javascript
// ✅ Usuários só acessam seus próprios dados
// ✅ Previne vazamento de dados pessoais
// ✅ Proteção contra acesso não autorizado
```

#### **2. 🏠 SITES DOS USUÁRIOS (/users/{userId}/sites/{siteId})**
```javascript
// ✅ Cada usuário só vê seus próprios sites
// ✅ Previne que usuário A veja sites do usuário B
// ✅ Proteção total de privacidade
```

#### **3. 🌐 SITES GLOBAIS (/sites/{siteId})**
```javascript
// ✅ Qualquer um pode VER sites publicados (isPublished: true)
// ✅ Apenas o dono pode EDITAR seus sites
// ✅ Permite visualização pública sem acesso aos dados privados
```

#### **4. 📄 SITES PUBLICADOS (/published_sites/{siteId})**
```javascript
// ✅ Qualquer um pode ler o HTML final
// ✅ Apenas o dono pode publicar/atualizar
// ✅ Permite que sites sejam acessados por visitantes
```

#### **5. 🎨 TEMPLATES (/templates/{templateId})**
```javascript
// ✅ Todos podem ler templates disponíveis
// ✅ Apenas admins podem criar/editar templates
// ✅ Proteção contra modificação indevida
```

## 🚀 COMO APLICAR NO FIREBASE

### **Passo 1: Acessar Firebase Console**
```
1. Vá para: https://console.firebase.google.com/project/turflow
2. Clique em "Firestore Database"
3. Clique na aba "Rules"
```

### **Passo 2: Substituir Regras**
```
1. Apague as regras atuais
2. Cole as novas regras do arquivo firestore.rules
3. Clique "Publish"
```

### **Passo 3: Testar**
```
1. Teste login no seu SAAS
2. Teste criação de sites
3. Teste visualização de sites publicados
4. Verifique se não há erros de permissão
```

## 🔧 CONFIGURAÇÕES ADICIONAIS

### **Para adicionar ADMINs:**
```javascript
// Na regra de templates, substitua pelos seus UIDs:
allow write: if request.auth != null && 
  request.auth.uid in ['SEU_UID_ADMIN', 'OUTRO_UID_ADMIN'];
```

### **Para obter seu UID:**
```javascript
// No console do browser (F12), após fazer login:
console.log('Meu UID:', auth.currentUser.uid);
```

## ⚠️ IMPORTANTE

### **Antes de aplicar:**
1. **Faça backup** das regras atuais
2. **Teste em ambiente de desenvolvimento** primeiro
3. **Monitore logs** de erro após aplicar

### **Se der erro:**
1. Verifique se todas as coleções existem
2. Verifique se os campos `userId` e `isPublished` estão corretos
3. Reverta para regras antigas se necessário

## 🎯 BENEFÍCIOS DAS NOVAS REGRAS

✅ **Segurança**: Cada usuário só acessa seus dados  
✅ **Privacidade**: Sites privados ficam privados  
✅ **Performance**: Consultas mais otimizadas  
✅ **Escalabilidade**: Preparado para muitos usuários  
✅ **Conformidade**: Segue boas práticas de segurança  

## 🚨 REGRA DE OURO

**"Sempre negue por padrão, permita apenas o necessário"**

Suas novas regras seguem este princípio - qualquer acesso não especificado será negado automaticamente.

---

**🎉 Suas regras estão prontas para produção!**
