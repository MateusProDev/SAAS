const admin = require('firebase-admin');

// Inicializar Firebase Admin
// Verificar variáveis necessárias
const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Faltam as seguintes variáveis de ambiente: ${missingVars.join(', ')}`);
}

// Configuração do Firebase usando variáveis individuais
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL
};

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function migrateSitesToSlugs() {
  try {
    console.log('🔄 Iniciando migração de slugs...');
    
    // Criar coleção de slugs se não existir
    const db = admin.firestore();
    const slugsRef = db.collection('slugs');
    
    // Buscar todos os usuários
    const usersSnapshot = await db.collection('users').get();
    console.log(`📊 Encontrados ${usersSnapshot.size} usuários`);

    for (const userDoc of usersSnapshot.docs) {
      // Buscar sites do usuário
      const sitesSnapshot = await userDoc.ref.collection('sites').get();
      console.log(`👤 Processando ${sitesSnapshot.size} sites para usuário ${userDoc.id}`);

      for (const siteDoc of sitesSnapshot.docs) {
        const siteData = siteDoc.data();
        
        // Pular se já tiver slug
        if (siteData.slug) {
          console.log(`⏭️ Site ${siteDoc.id} já tem slug: ${siteData.slug}`);
          continue;
        }

        const name = siteData.name || siteData.title || 'site';
        const baseSlug = name.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Gerar slug único
        let slug = baseSlug;
        let counter = 1;
        let isUnique = false;

        while (!isUnique) {
          const slugCheck = await slugsRef.where('slug', '==', slug).get();
          if (slugCheck.empty) {
            isUnique = true;
          } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
          }
        }

        // Atualizar o documento do site com o novo slug
        await siteDoc.ref.update({ slug });

        // Criar registro na coleção de slugs
        await slugsRef.add({
          slug,
          userId: userDoc.id,
          siteId: siteDoc.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`✅ Site ${siteDoc.id} migrado para slug: ${slug}`);
      }
    }

    console.log('🎉 Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração
migrateSitesToSlugs();
