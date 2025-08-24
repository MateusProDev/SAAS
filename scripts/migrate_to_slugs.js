const admin = require('../backend/config/firebase');
const { generateUniqueSlug } = require('../backend/utils/slugs');

async function migrateSitesToSlugs() {
  try {
    const usersSnapshot = await admin.firestore().collection('users').get();

    for (const userDoc of usersSnapshot.docs) {
      const sitesSnapshot = await userDoc.ref.collection('sites').get();

      for (const siteDoc of sitesSnapshot.docs) {
        const siteData = siteDoc.data();
        const name = siteData.name || siteData.title || 'site';

        // Gerar slug único
        const slug = await generateUniqueSlug(name, admin.firestore());

        // Atualizar o documento do site com o novo slug
        await siteDoc.ref.update({ slug });

        // Criar registro na coleção de slugs
        await admin.firestore().collection('slugs').add({
          slug,
          userId: userDoc.id,
          siteId: siteDoc.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Migrated site ${siteDoc.id} to slug: ${slug}`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrateSitesToSlugs();
