const admin = require('firebase-admin');

// Configuração do Firebase Admin
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

console.log('🔍 DEBUG - Variáveis Firebase disponíveis:');
console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Existe' : '❌ Não existe');
console.log('- FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Existe' : '❌ Não existe');
console.log('- FIREBASE_SERVICE_ACCOUNT_JSON:', process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? '✅ Existe' : '❌ Não existe');
console.log('- FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Existe' : '❌ Não existe');

// Tentar diferentes formatações da chave privada
if (privateKey) {
  // Remover escapes duplos e simples
  privateKey = privateKey.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
  
  // Se não começar com BEGIN, pode estar mal formatada
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    console.error('❌ Chave privada não parece estar no formato correto');
    console.log('🔍 Primeiros 100 caracteres:', privateKey.substring(0, 100));
  } else {
    console.log('✅ Chave privada parece estar no formato correto');
  }
}

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: privateKey,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

// Inicializar Firebase Admin apenas se ainda não foi inicializado
if (!admin.apps.length) {
  try {
    // Método 1: Usar as variáveis individuais
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
    });
    console.log('✅ Firebase inicializado com sucesso usando variáveis individuais');
  } catch (error) {
    console.error('❌ Erro ao inicializar com variáveis individuais:', error.message);
    
    try {
      // Método 2: Tentar usando JSON completo se disponível
      if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const serviceAccountFromJSON = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountFromJSON),
          databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
        });
        console.log('✅ Firebase inicializado com sucesso usando JSON completo');
      } else {
        throw new Error('Nenhum método de autenticação funcionou');
      }
    } catch (jsonError) {
      console.error('❌ Erro final ao inicializar Firebase:', jsonError.message);
      throw jsonError;
    }
  }
}

module.exports = admin;
