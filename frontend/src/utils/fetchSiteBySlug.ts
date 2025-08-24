import { db } from './firebase';

export async function fetchSiteBySlug(slug: string) {
  try {
    // Buscar o documento na coleção de slugs
    const slugDoc = await db.collection('slugs').where('slug', '==', slug).get();
    
    if (slugDoc.empty) {
      throw new Error('Site não encontrado');
    }

    // Pegar o primeiro documento (deve ser único)
    const siteData = slugDoc.docs[0].data();
    const userId = siteData.userId;
    const siteId = siteData.siteId;

    // Buscar os dados completos do site
    const siteDoc = await db
      .collection('users')
      .doc(userId)
      .collection('sites')
      .doc(siteId)
      .get();

    if (!siteDoc.exists) {
      throw new Error('Site não encontrado');
    }

    return {
      id: siteDoc.id,
      ...siteDoc.data(),
      slug
    };
  } catch (error) {
    console.error('Error fetching site by slug:', error);
    throw error;
  }
}
