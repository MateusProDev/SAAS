# 🚀 Guia Completo: Deploy Backend no Render

## 📋 **Credenciais Firebase Admin SDK (Para copiar/colar)**

**Use estas credenciais EXATAS no Render:**

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Firebase Admin SDK - VALORES REAIS
FIREBASE_PROJECT_ID=turflow
FIREBASE_PRIVATE_KEY_ID=d032eea02e4d425f7eb3433d15e50d014960d3bd
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCXMe9OxKfUUqqR
pBaixmCXWJhf+V7a7cwjlUul4dB3OJPzv2aLRqtiWRUpaP7MSkeQvfLkSWIXWM7d
JM2cMdSvqUROBHd/y3b1/XF+rTC4sltO8oot0sQypyiAnQyiPLjZwNPXjqZXU5cL
3XJ4cRS/GAN0LK27+D5nHfxX4hxiAvznmweHoAl8XlFr5QznIqZowFoyw2hkTJvr
7LdjwK2pkS1mX3octReJAMfVVDKF8eX3N7B3xq4Fbj+jNGXOPyH+RyfuIW3Cyimc
nmC76VtlVyfu4wburDE3+YH8h7bqbJz7YWWOG3tYqTkkzxhVK035Rzw3bpPKx6D2
1EgbdsQNAgMBAAECggEAOCtB5zZhzxxC58ZY7nHaUn+EZCtFVPoA27tMFj008AWh
2Wzi0J0ZcHj9xpuOBSEXQyt9/9dPTLMebsOMaxmMFRJCIOXB60UQVcSpFFGNByCj
kUnDkdB6OQMmpdkyZ1c9qQ/c43jITSrts2e6bgo8ld168v7iMDHCJRbbt152Aubd
FcVn3POm12/sTZap9nPzbg3WIhWGxRal/h9CN/kFXKQkWOtKPqK7wTqPSrjcyg0c
wkcXEPwrV8yCECbX8vI/3lyiIxmG+jQZP1B6vVYGQL6YMZRD7YPG+w+ceyMBchg7
5Kj7p+VtQxDmb8ZuoX0c75QtQ8Yd5EdiPKzBi13vNQKBgQDFanuCVuon75HwA+TJ
cToLST2mjodOdiXG8GUhubZUuRs/Xt86QUDtbomTGEYldtDQEaFX9/SF2z/x2XQR
BPiB/6c52fydr0Bn7lZVNmJzvxVwtZoucL+p5wskKKxPT3T93FjCeOIOI91Ye/9f
cBOKzB64J+adxaG6yu2CPgRZ4wKBgQDEEBd1mpO17H6d7wUYLlt9e3VTO86SYSq+
GDX/eHt98aIMowQveejfddhYZrT/Q8mgcbT+BR+CebG08LgzyyKHuGx3UZA4FFjR
EeO2tmFnSgNqx85CuUAq13BPsCI5p8GmaLNcJwOkfK7s7EOkVD7sy+2dTo1GQNDU
ia5/CX+NTwKBgQCEkUnZL9ZT9QuSGntDTraEp60vsJxp8urRWdL/v78Ry6/hcSsD
6pfYGRdnYLCSLeRxJLWs5gQc8ytQlA7d8vGSEoRQU/LQTMQ6RpFQ7ZFVWqbiJgEg
WHRMeqs/n9R9+cR9SL+N8DEU/75+0d2eUBu/Y+zpC1pQ7kr5rZWqlUzEswKBgHzb
HoVnHd/BrlRXLXBbvSmo4GtT79XqCPUrp99703C92wufGIA/a1w6yL5rEaJpgdIp
9y+5BXrqko9+qF9bYi759CD8ERKVaoYhlVj6xgan7IsomKKHJGTj84Lb0L/UpA6c
KHRr5/bs69y3DNBuUfAsYbJGntL5XcOrtjLyUocjAoGAROPDKLvxcTldwTIw6hj2
b1f3FuryihUJLhsreNFmAAmwmrPZD/QzhfRZCIFdBV8QrPJB5vDrErJ8BYyUKas/
5ChbMxsRfAf4qbkFGtF/xSMgCY26PhgzcwST+ERa0g423+5Zzkg2m0yu02hVwvZG
KLX2tAiq4pgm32pBhWGUYnA=
-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@turflow.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=114415825923292929575

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dhiazdqkj
CLOUDINARY_API_KEY=631923265877232
CLOUDINARY_API_SECRET=K7AIivPOqX3RQA-cfNEKxbQgIYE

# CORS - URL do Frontend (ATUALIZE após o deploy)
FRONTEND_URL=https://frontend-2vfjdwtbe-mateus-ferreiras-projects.vercel.app
```

## 🚀 **Passos para Deploy no Render:**

### **1. Acesse o Render**
- Vá em: https://dashboard.render.com
- Faça login ou crie conta

### **2. Criar Web Service**
1. Clique **"New"** → **"Web Service"**
2. **Connect GitHub** → Autorize e selecione `MateusProDev/SAAS`
3. **Configurações:**
   - **Name**: `saas-website-builder-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: `Ohio (US East)`
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (para teste)

### **3. Environment Variables**
Na seção **Environment Variables**, adicione **UMA POR UMA**:

| Variable Name | Value |
|---------------|-------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `FIREBASE_PROJECT_ID` | `turflow` |
| `FIREBASE_PRIVATE_KEY_ID` | `d032eea02e4d425f7eb3433d15e50d014960d3bd` |
| `FIREBASE_PRIVATE_KEY` | **[Cole a private key completa com quebras de linha]** |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@turflow.iam.gserviceaccount.com` |
| `FIREBASE_CLIENT_ID` | `114415825923292929575` |
| `CLOUDINARY_CLOUD_NAME` | `dhiazdqkj` |
| `CLOUDINARY_API_KEY` | `631923265877232` |
| `CLOUDINARY_API_SECRET` | `K7AIivPOqX3RQA-cfNEKxbQgIYE` |
| `FRONTEND_URL` | `https://frontend-2vfjdwtbe-mateus-ferreiras-projects.vercel.app` |

### **4. Deploy**
- Clique **"Create Web Service"**
- Aguarde o build e deploy (5-10 minutos)

### **5. Após Deploy**
- Copie a URL gerada (ex: `https://saas-backend-xyz.onrender.com`)
- Atualize no Vercel: `VITE_API_URL=https://sua-url-do-render.onrender.com/api`

## ⚠️ **IMPORTANTE:**
- Cole a `FIREBASE_PRIVATE_KEY` com todas as quebras de linha `\n`
- Mantenha as aspas duplas na private key
- Não remova os `-----BEGIN/END PRIVATE KEY-----`

**Está pronto para deploy! 🚀**
