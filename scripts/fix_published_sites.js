// Script para garantir que todos os sites publicados tenham published_sites e slugs corretos
// Rode manualmente: node scripts/fix_published_sites.js

// Script para garantir que todos os sites publicados tenham published_sites e slugs corretos
// Rode manualmente: node scripts/fix_published_sites.js


const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
console.log('Iniciando fix_published_sites.js');
console.log('Arquivo de credenciais:', require('path').resolve(__dirname, '../serviceAccountKey.json'));
console.log('Project ID do Firebase:', serviceAccount.project_id);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function main() {
  // --- Garantir published_sites e slugs para todos os sites em users/*/sites ---
  console.log('\n[SINCRONIZAÇÃO] Garantindo que todos os sites em users/*/sites tenham published_sites e slugs...');
  let createdPublished = 0, createdSlugs = 0;
    const allSitesQuery1 = await admin.firestore().collectionGroup('sites').get();
  for (const siteDoc of allSitesQuery1.docs) {
    const site = siteDoc.data();
    const siteId = siteDoc.id;
    const userId = siteDoc.ref.parent.parent.id;
    if (!site.slug) continue;
    // published_sites
    const pubRef = admin.firestore().collection('published_sites').doc(siteId);
    const pubSnap = await pubRef.get();
    if (!pubSnap.exists) {
      await pubRef.set({
        siteId,
        userId,
        slug: site.slug,
        name: site.name || '',
        template: site.template || '',
        active: typeof site.active === 'boolean' ? site.active : true,
        published: typeof site.published === 'boolean' ? site.published : false,
        createdAt: site.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: site.updatedAt || admin.firestore.FieldValue.serverTimestamp(),
        publishedAt: site.publishedAt || null,
        content: site.content || '',
        views: typeof site.views === 'number' ? site.views : 0
      }, { merge: true });
      createdPublished++;
      console.log(`[SINCRONIZADO] published_sites/${siteId} criado.`);
    }
    // slugs
    const slugRef = admin.firestore().collection('slugs').doc(site.slug);
    const slugSnap = await slugRef.get();
    if (!slugSnap.exists) {
      await slugRef.set({ userId, siteId }, { merge: true });
      createdSlugs++;
      console.log(`[SINCRONIZADO] slugs/${site.slug} criado.`);
    }
  }
  console.log(`[SINCRONIZAÇÃO] published_sites criados: ${createdPublished}, slugs criados: ${createdSlugs}`);
  // --- Restauração automática de sites a partir de published_sites ---
  console.log('\n[RESTAURAÇÃO] Garantindo que todos os published_sites existam em users/{userId}/sites/{siteId}...');
  const pubsSnap = await admin.firestore().collection('published_sites').get();
  let restored = 0;
  for (const pubDoc of pubsSnap.docs) {
    const pub = pubDoc.data();
    const userId = pub.userId;
    const siteId = pub.siteId;
    if (!userId || !siteId) continue;
    const userSiteRef = admin.firestore().collection('users').doc(userId).collection('sites').doc(siteId);
    const userSiteSnap = await userSiteRef.get();
    if (!userSiteSnap.exists) {
      // Cria o documento a partir do published_site
      await userSiteRef.set({
        ...pub,
        restoredFromPublished: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      restored++;
      console.log(`[RESTAURADO] users/${userId}/sites/${siteId} criado a partir de published_sites/${siteId}`);
    }
  }
  console.log(`[RESTAURAÇÃO] Total de sites restaurados: ${restored}`);
  let totalSites = 0, fixedPublished = 0, fixedSlugs = 0;
  // Busca todos os sites em todas as subcoleções users/*/sites
    const allSitesQuery2 = await admin.firestore().collectionGroup('sites').get();
  console.log(`Total de sites encontrados em todas as subcoleções users/*/sites: ${allSitesQuery2.size}`);
  if (allSitesQuery2.size === 0) {
    console.log('Nenhum site encontrado em nenhuma subcoleção users/*/sites.');
  }
  for (const siteDoc of allSitesQuery2.docs) {
    totalSites++;
    const site = siteDoc.data();
    const siteId = siteDoc.id;
    // userId é o ID do documento pai de users
    let userId = null;
    if (siteDoc.ref.parent && siteDoc.ref.parent.parent) {
      userId = siteDoc.ref.parent.parent.id;
    } else {
      console.log(`Site ignorado (estrutura inesperada): ${siteId}`);
      continue;
    }
    console.log(`Site: ${siteId} | userId: ${userId} | slug: ${site.slug} | name: ${site.name || site.title}`);
    // published_sites e slugs para todo site que tenha slug (publicado ou não)
    // Corrige/atualiza todos os campos essenciais no próprio site
    let slug = site.slug;
    if (!slug) {
      const base = site.name || site.title || 'site';
      slug = base.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + siteId.slice(-6);
    }
    const updateFields = {
      slug,
      siteId,
      userId,
      active: typeof site.active === 'boolean' ? site.active : true,
      views: typeof site.views === 'number' ? site.views : 0,
      name: site.name || site.title || '',
      template: site.template || 'comercial',
    };
    await admin.firestore().collection('users').doc(userId).collection('sites').doc(siteId).set(updateFields, { merge: true });

    // published_sites
  const pubRef = admin.firestore().collection('published_sites').doc(siteId);
  // Copia todos os campos do site do usuário para published_sites
  const allFields = { ...site, siteId, userId, slug };
  await pubRef.set(allFields, { merge: true });
  fixedPublished++;

    // slugs
    const slugRef = admin.firestore().collection('slugs').doc(slug);
    await slugRef.set({ userId, siteId }, { merge: true });
    fixedSlugs++;
  }
  console.log(`\nResumo final:`);
  console.log(`Total sites: ${totalSites}, published_sites criados/atualizados: ${fixedPublished}, slugs criados/atualizados: ${fixedSlugs}`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
