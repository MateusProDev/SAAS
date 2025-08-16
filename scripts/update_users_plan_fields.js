// Script para garantir que todos os usuários existentes no Firestore tenham os campos obrigatórios para planos SaaS
// Execute este script no backend Node.js

const admin = require('firebase-admin');

// Inicialize o Firebase Admin se ainda não estiver inicializado
if (!admin.apps.length) {
  try {
    // Tente inicializar com serviceAccountKey.json
    const serviceAccount = require('../serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (err) {
    // Se não houver arquivo, tente credencial padrão
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }
}

async function updateAllUsersWithPlanFields() {
  const usersRef = admin.firestore().collection('users');
  const snapshot = await usersRef.get();
  const batch = admin.firestore().batch();

  snapshot.forEach(doc => {
    const data = doc.data();
    const update = {
      plan: data.plan || 'free',
      maxSites: typeof data.maxSites === 'number' ? data.maxSites : 1,
      currentSites: typeof data.currentSites === 'number' ? data.currentSites : 0,
      customDomain: typeof data.customDomain === 'boolean' ? data.customDomain : false,
      createdAt: data.createdAt || admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      activeUntil: data.activeUntil || null
    };
    batch.update(doc.ref, update);
  });

  await batch.commit();
  console.log('Todos os usuários atualizados com campos obrigatórios de plano!');
}

updateAllUsersWithPlanFields().catch(console.error);
