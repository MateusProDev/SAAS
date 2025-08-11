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
  let totalSites = 0, fixedPublished = 0, fixedSlugs = 0;
  // Busca todos os sites em todas as subcoleções users/*/sites
  const sitesQuery = await admin.firestore().collectionGroup('sites').get();
  console.log(`Total de sites encontrados em todas as subcoleções users/*/sites: ${sitesQuery.size}`);
  if (sitesQuery.size === 0) {
    console.log('Nenhum site encontrado em nenhuma subcoleção users/*/sites.');
  }
  for (const siteDoc of sitesQuery.docs) {
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
    await pubRef.set({
      siteId,
      userId,
      slug,
      name: updateFields.name,
      template: updateFields.template,
      content: site.content || '',
      publishedAt: site.publishedAt || null,
      active: updateFields.active,
      views: updateFields.views
    }, { merge: true });
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
