# 🔐 COMO RESOLVER ALERTA DE SEGURANÇA NO GITHUB

## 🎯 PASSOS PARA RESOLVER O ALERTA

### 1. **ACESSAR OS ALERTAS DE SEGURANÇA**
```
1. Vá para: https://github.com/MateusProDev/SAAS
2. Clique na aba "Security" (🛡️)
3. Clique em "Secret scanning alerts"
4. Encontre o alerta: "Google API Key"
```

### 2. **REVOGAR A CHAVE NO FIREBASE PRIMEIRO**
```
⚠️ IMPORTANTE: Faça isso ANTES de fechar o alerta!

1. Acesse: https://console.firebase.google.com/project/turflow/settings/general/
2. Vá em "Configuração do SDK" > "Configuração"
3. Role até "Chaves de API da web"
4. Encontre: AIzaSyD89w...91Og
5. Clique no ícone da lixeira 🗑️
6. Confirme "Deletar chave"
7. Gere uma nova chave
```

### 3. **MARCAR ALERTA COMO RESOLVIDO**
```
1. Volte para o GitHub Security Alert
2. Clique no alerta da chave
3. Clique em "Dismiss alert" ou "Resolve"
4. Selecione: "Revoked" 
5. Adicione comentário: "Chave revogada no Firebase Console e nova chave gerada"
6. Clique "Dismiss alert"
```

## 🚨 MÉTODO 2: REMOVER DO HISTÓRICO DO GIT (SE NECESSÁRIO)

Se o alerta persistir, você pode limpar o histórico:

### **Opção A: Remover arquivo específico do histórico**
```bash
# CUIDADO: Isso reescreve o histórico!
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch DEPLOY-UPDATED.md' \
  --prune-empty --tag-name-filter cat -- --all
```

### **Opção B: Usar BFG Cleaner (RECOMENDADO)**
```bash
# 1. Instalar BFG
# Baixe de: https://rtyley.github.io/bfg-repo-cleaner/

# 2. Fazer backup do repo
git clone --mirror https://github.com/MateusProDev/SAAS.git

# 3. Limpar a chave
java -jar bfg.jar --replace-text passwords.txt SAAS.git

# 4. Criar arquivo passwords.txt com:
# CHAVE_FIREBASE_EXPOSTA_AQUI

# 5. Push forçado
cd SAAS.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

### **Opção C: Reset completo (DRÁSTICO)**
```bash
# ⚠️ CUIDADO: Isso remove TODO o histórico!

# 1. Criar novo branch sem histórico
git checkout --orphan novo-main

# 2. Adicionar todos os arquivos atuais (já limpos)
git add .

# 3. Commit inicial
git commit -m "Initial commit - Repositório limpo de dados sensíveis"

# 4. Deletar branch antigo
git branch -D main

# 5. Renomear novo branch
git branch -m main

# 6. Push forçado
git push -f origin main
```

## 🎯 MÉTODO RECOMENDADO

**Para resolver rapidamente:**

1. ✅ **REVOGAR** chave no Firebase Console
2. ✅ **GERAR** nova chave
3. ✅ **ATUALIZAR** .env.local e Vercel
4. ✅ **MARCAR** alerta como "Revoked" no GitHub
5. ✅ **MONITORAR** por alguns dias

## 🔍 VERIFICAÇÃO FINAL

Após resolver:
```bash
# 1. Verificar se alerta sumiu
# GitHub > Security > Secret scanning alerts (deve estar vazio)

# 2. Testar nova chave
cd frontend
npm run dev

# 3. Verificar logs Firebase
# Console Firebase > Authentication > Usage
```

## 📋 CHECKLIST COMPLETO

- [ ] Revogou chave no Firebase Console
- [ ] Gerou nova chave Firebase  
- [ ] Atualizou .env.local
- [ ] Atualizou variáveis Vercel
- [ ] Marcou alerta GitHub como "Revoked"
- [ ] Testou login/register funcionando
- [ ] Verificou logs por atividade suspeita

**✅ RESULTADO**: Repositório seguro, aplicação funcionando, alerta resolvido!
