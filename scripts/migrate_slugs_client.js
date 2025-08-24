// Firebase Client SDK
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, addDoc, query, where } = require('firebase/firestore');

// Verificar variáveis necessárias
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Faltam as seguintes variáveis de ambiente: ${missingVars.join(', ')}`);
}

// Configuração do Firebase Client
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateSitesToSlugs() {
  try {
    console.log('🔄 Iniciando migração de slugs...');
    
    // Buscar todos os usuários
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    console.log(`📊 Encontrados ${usersSnapshot.size} usuários`);

    for (const userDoc of usersSnapshot.docs) {
      // Buscar sites do usuário
      const sitesRef = collection(db, 'users', userDoc.id, 'sites');
      const sitesSnapshot = await getDocs(sitesRef);
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
          const slugsRef = collection(db, 'slugs');
          const slugCheck = query(slugsRef, where('slug', '==', slug));
          const slugSnapshot = await getDocs(slugCheck);
          
          if (slugSnapshot.empty) {
            isUnique = true;
          } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
          }
        }

        // Atualizar o documento do site com o novo slug
        const siteRef = doc(db, 'users', userDoc.id, 'sites', siteDoc.id);
        await updateDoc(siteRef, { slug });

        // Criar registro na coleção de slugs
        const slugsRef = collection(db, 'slugs');
        await addDoc(slugsRef, {
          slug,
          userId: userDoc.id,
          siteId: siteDoc.id,
          createdAt: new Date()
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
