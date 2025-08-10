// Script para garantir que todos os sites publicados tenham published_sites e slugs corretos
// Rode manualmente: node scripts/fix_published_sites.js


const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function main() {
  const usersSnap = await admin.firestore().collection('users').get();
  let totalSites = 0, fixedPublished = 0, fixedSlugs = 0;

  for (const userDoc of usersSnap.docs) {
    const userId = userDoc.id;
    const sitesSnap = await admin.firestore().collection('users').doc(userId).collection('sites').get();
    for (const siteDoc of sitesSnap.docs) {
      totalSites++;
      const site = siteDoc.data();
      const siteId = siteDoc.id;
      // published_sites
      if (site.isPublished && site.slug) {
        const pubRef = admin.firestore().collection('published_sites').doc(siteId);
        const pubSnap = await pubRef.get();
        if (!pubSnap.exists) {
          await pubRef.set({
            siteId,
            userId,
            slug: site.slug,
            name: site.name || site.title || '',
            content: site.content || '',
            publishedAt: site.publishedAt || admin.firestore.FieldValue.serverTimestamp(),
            active: true,
            views: 0
          }, { merge: true });
          fixedPublished++;
        }
        // slugs
        const slugRef = admin.firestore().collection('slugs').doc(site.slug);
        const slugSnap = await slugRef.get();
        if (!slugSnap.exists) {
          await slugRef.set({ userId, siteId });
          fixedSlugs++;
        }
      }
    }
  }
  console.log(`Total sites: ${totalSites}, published_sites criados: ${fixedPublished}, slugs criados: ${fixedSlugs}`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
