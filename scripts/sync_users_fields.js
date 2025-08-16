// Script para sincronizar campos obrigatórios na coleção 'users' do Firestore
// Execute este script no ambiente Node.js com credenciais de admin

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function syncUserFields() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();

  let updated = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    let needsUpdate = false;
    const updateData = {};

    // Garante plan
    if (!('plan' in data)) {
      updateData.plan = 'free';
      needsUpdate = true;
    }

    // Garante createdAt
    if (!('createdAt' in data)) {
      updateData.createdAt = new Date().toISOString();
      needsUpdate = true;
    }

    // Atualiza sempre updatedAt
    updateData.updatedAt = new Date().toISOString();
    needsUpdate = true;

    // Garante email
    if (!('email' in data) || !data.email) {
      updateData.email = doc.id.includes('@') ? doc.id : '';
      needsUpdate = true;
    }

    // Garante status
    if (!('status' in data)) {
      updateData.status = 'active';
      needsUpdate = true;
    }

    // Garante trialEndsAt para pro
    if (data.plan === 'pro' && !('trialEndsAt' in data)) {
      updateData.trialEndsAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      needsUpdate = true;
    }

    if (needsUpdate) {
      usersRef.doc(doc.id).update(updateData);
      updated++;
      console.log(`Usuário ${doc.id} atualizado:`, updateData);
    }
  });
  console.log(`Sincronização concluída. ${updated} usuários atualizados.`);
}

syncUserFields().catch(console.error);
